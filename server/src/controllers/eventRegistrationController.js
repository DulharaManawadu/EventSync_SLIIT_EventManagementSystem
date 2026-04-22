const mongoose = require('mongoose');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const User = require('../models/User');
const {
  signRegistrationQrToken,
  verifyRegistrationQrToken
} = require('../utils/qrToken');

const QR_VERSION = 1;

const isValidId = (id) => mongoose.isValidObjectId(id);
const buildEventLookup = (eventId) => ({
  $or: [{ eventId }, { event: eventId }]
});

async function syncEventCounters(eventId) {
  const [registrationCount, attendanceCount] = await Promise.all([
    EventRegistration.countDocuments(buildEventLookup(eventId)),
    EventRegistration.countDocuments({
      ...buildEventLookup(eventId),
      attendanceStatus: 'Attended'
    })
  ]);

  const event = await Event.findByIdAndUpdate(
    eventId,
    {
      registrationCount,
      attendanceCount
    },
    { new: true }
  );

  return event;
}

function buildRegistrationPayload(registration, event) {
  return {
    registrationId: registration._id,
    eventId: registration.eventId,
    eventTitle: event?.title || '',
    studentId: registration.studentId,
    studentUserId: registration.studentUserId,
    qrVersion: registration.qrVersion,
    qrToken: registration.qrToken
  };
}

function buildRegistrationResponse(registration, event) {
  if (!registration) {
    return null;
  }

  return {
    id: registration._id,
    eventId: registration.eventId,
    studentId: registration.studentId,
    studentUserId: registration.studentUserId,
    studentName: registration.studentName,
    studentEmail: registration.studentEmail,
    registeredAt: registration.registeredAt,
    attendanceStatus: registration.attendanceStatus,
    checkedInAt: registration.checkedInAt,
    checkedInBy: registration.checkedInBy,
    qrToken: registration.qrToken,
    qrVersion: registration.qrVersion,
    qrPayload: buildRegistrationPayload(registration, event)
  };
}

function buildAdminEventSummaryRow(event, summary) {
  const registered = summary?.registered || 0;
  const attended = summary?.attended || 0;

  return {
    id: event._id,
    title: event.title,
    date: event.date,
    venue: event.venue,
    category: event.category,
    faculty: event.faculty,
    registered,
    attended,
    noShows: Math.max(registered - attended, 0),
    checkInActive: Boolean(event.checkInActive)
  };
}

async function ensureStudent(req, res) {
  const student = await User.findById(req.user.id);
  if (!student || student.userType !== 'Student') {
    res.status(403).json({
      success: false,
      message: "Sorry, you don't have proper authorization for this feature"
    });
    return null;
  }

  return student;
}

async function registerForEvent(req, res) {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const student = await ensureStudent(req, res);
    if (!student) return;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Registration is available only for approved events'
      });
    }

    if (!event.qrEnabled) {
      return res.status(400).json({
        success: false,
        message: 'QR registration is not enabled for this event'
      });
    }

    let registration = await EventRegistration.findOne({
      ...buildEventLookup(eventId),
      studentId: student._id
    });

    let alreadyRegistered = Boolean(registration);

    if (!registration) {
      if (event.isFull && !event.waitlistEnabled) {
        return res.status(400).json({
          success: false,
          message: 'Event is at full capacity',
          isFull: true
        });
      }

      let lastCreateError = null;

      for (let attempt = 0; attempt < 2 && !registration; attempt += 1) {
        const registrationId = new mongoose.Types.ObjectId();
        const qrToken = signRegistrationQrToken({
          type: 'event-registration',
          registrationId: registrationId.toString(),
          eventId: event._id.toString(),
          studentId: student._id.toString(),
          qrVersion: QR_VERSION
        });

        try {
          registration = await EventRegistration.create({
            _id: registrationId,
            event: event._id,
            eventId: event._id,
            studentId: student._id,
            studentUserId: student.userId,
            studentName: `${student.firstName} ${student.lastName}`.trim(),
            studentEmail: student.email,
            qrToken,
            qrVersion: QR_VERSION
          });
        } catch (createErr) {
          lastCreateError = createErr;

          if (createErr?.code !== 11000) {
            throw createErr;
          }

          registration = await EventRegistration.findOne({
            ...buildEventLookup(eventId),
            studentId: student._id
          });

          if (registration) {
            alreadyRegistered = true;
            break;
          }
        }
      }

      if (!registration) {
        console.error('Registration creation fallback failed:', {
          eventId: event._id.toString(),
          studentId: student._id.toString(),
          duplicateKey: lastCreateError?.keyValue || null
        });

        return res.status(500).json({
          success: false,
          message: 'Unable to finalize event registration at the moment'
        });
      }
    }

    const updatedEvent = await syncEventCounters(event._id);

    return res.json({
      success: true,
      message: alreadyRegistered
        ? 'Existing registration QR retrieved successfully'
        : 'Registered for event successfully',
      data: {
        registration: buildRegistrationResponse(registration, updatedEvent || event),
        event: updatedEvent || event,
        alreadyRegistered
      }
    });
  } catch (err) {
    console.error('Register For Event Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while registering for event',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getMyEventQr(req, res) {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const student = await ensureStudent(req, res);
    if (!student) return;

    const [event, registration] = await Promise.all([
      Event.findById(eventId),
      EventRegistration.findOne({ ...buildEventLookup(eventId), studentId: student._id })
    ]);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'You have not registered for this event yet'
      });
    }

    return res.json({
      success: true,
      message: 'Event QR retrieved successfully',
      data: {
        registration: buildRegistrationResponse(registration, event),
        event
      }
    });
  } catch (err) {
    console.error('Get My Event QR Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while retrieving QR details',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function scanAndCheckIn(req, res) {
  try {
    const { qrToken, eventId } = req.body || {};

    if (!qrToken || typeof qrToken !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'QR token is required'
      });
    }

    if (!eventId || !isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid selected event ID is required'
      });
    }

    let decoded;
    try {
      decoded = verifyRegistrationQrToken(qrToken);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or tampered QR code'
      });
    }

    if (
      decoded.type !== 'event-registration' ||
      !isValidId(decoded.registrationId) ||
      !isValidId(decoded.eventId) ||
      !isValidId(decoded.studentId)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR payload'
      });
    }

    const [registration, admin] = await Promise.all([
      EventRegistration.findById(decoded.registrationId),
      User.findById(req.user.id)
    ]);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found for this QR code'
      });
    }

    if (
      registration.qrToken !== qrToken ||
      registration.eventId.toString() !== decoded.eventId ||
      registration.studentId.toString() !== decoded.studentId
    ) {
      return res.status(400).json({
        success: false,
        message: 'QR code does not match the stored registration'
      });
    }

    if (registration.eventId.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: 'This QR belongs to a different event than the one currently selected'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (event.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: 'Attendance can only be confirmed for approved events'
      });
    }

    if (!event.checkInActive) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is not active for the selected event'
      });
    }

    if (registration.attendanceStatus === 'Attended') {
      return res.status(400).json({
        success: false,
        message: 'Attendance has already been confirmed for this student'
      });
    }

    registration.attendanceStatus = 'Attended';
    registration.checkedInAt = new Date();
    registration.checkedInBy = admin?._id || null;
    await registration.save();

    const updatedEvent = await syncEventCounters(event._id);

    return res.json({
      success: true,
      message: 'Attendance confirmed successfully',
      data: {
        registration: buildRegistrationResponse(registration, updatedEvent || event),
        event: updatedEvent || event
      }
    });
  } catch (err) {
    console.error('Scan And Check-In Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred during check-in',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function updateCheckInStatus(req, res) {
  try {
    const { eventId } = req.params;
    const { checkInActive } = req.body || {};

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    if (typeof checkInActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'checkInActive must be a boolean value'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.checkInActive = checkInActive;
    await event.save();

    const [registered, attended] = await Promise.all([
      EventRegistration.countDocuments(buildEventLookup(event._id)),
      EventRegistration.countDocuments({
        ...buildEventLookup(event._id),
        attendanceStatus: 'Attended'
      })
    ]);

    return res.json({
      success: true,
      message: `Check-in ${checkInActive ? 'activated' : 'disabled'} successfully`,
      data: buildAdminEventSummaryRow(event, { registered, attended })
    });
  } catch (err) {
    console.error('Update Check-In Status Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while updating check-in status',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getEventAttendanceTable(req, res) {
  try {
    const { eventId } = req.params;

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const registrations = await EventRegistration.find(buildEventLookup(eventId))
      .populate('checkedInBy', 'firstName lastName userId email')
      .sort({ registeredAt: 1 });

    const registeredCount = registrations.length;
    const attendedCount = registrations.filter(
      (registration) => registration.attendanceStatus === 'Attended'
    ).length;

    const syncedEvent = await syncEventCounters(event._id);

    return res.json({
      success: true,
      message: 'Attendance table retrieved successfully',
      data: {
        event: syncedEvent || event,
        summary: {
          registered: registeredCount,
          attended: attendedCount,
          noShows: Math.max(registeredCount - attendedCount, 0)
        },
        rows: registrations.map((registration) => ({
          id: registration._id,
          studentId: registration.studentUserId,
          studentName: registration.studentName,
          studentEmail: registration.studentEmail,
          registeredAt: registration.registeredAt,
          attendanceStatus: registration.attendanceStatus,
          checkedInAt: registration.checkedInAt,
          checkedInBy: registration.checkedInBy
            ? {
                id: registration.checkedInBy._id,
                name: `${registration.checkedInBy.firstName || ''} ${registration.checkedInBy.lastName || ''}`.trim(),
                userId: registration.checkedInBy.userId,
                email: registration.checkedInBy.email
              }
            : null
        }))
      }
    });
  } catch (err) {
    console.error('Get Event Attendance Table Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while retrieving attendance data',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function deleteRegistration(req, res) {
  try {
    const { registrationId } = req.params;

    if (!isValidId(registrationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration ID format'
      });
    }

    const registration = await EventRegistration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    const eventId = registration.eventId || registration.event;
    await EventRegistration.deleteOne({ _id: registration._id });
    const updatedEvent = await syncEventCounters(eventId);

    return res.json({
      success: true,
      message: 'Registration removed successfully',
      data: {
        registrationId,
        event: updatedEvent
      }
    });
  } catch (err) {
    console.error('Delete Registration Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting registration',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getMyRegistrations(req, res) {
  try {
    const student = await ensureStudent(req, res);
    if (!student) return;

    const registrations = await EventRegistration.find({ studentId: student._id })
      .sort({ registeredAt: -1 })
      .lean();

    const eventIds = registrations.map((registration) => registration.eventId);
    const events = await Event.find({ _id: { $in: eventIds } })
      .select('_id title date venue category faculty status checkInActive')
      .lean();

    const eventsMap = new Map(events.map((event) => [event._id.toString(), event]));

    return res.json({
      success: true,
      message: 'Student registrations retrieved successfully',
      data: registrations
        .map((registration) => {
          const event = eventsMap.get(registration.eventId.toString());
          if (!event) return null;

          return {
            registration: buildRegistrationResponse(registration, event),
            event: {
              ...event,
              id: event._id
            }
          };
        })
        .filter(Boolean)
    });
  } catch (err) {
    console.error('Get My Registrations Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while retrieving registrations',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

async function getAdminQrEventSummary(req, res) {
  try {
    const events = await Event.find({ status: 'Approved', qrEnabled: true })
      .select('_id title date venue category faculty registrationCount attendanceCount')
      .sort({ date: 1 });

    const registrationSummary = await EventRegistration.aggregate([
      {
        $addFields: {
          effectiveEventId: { $ifNull: ['$eventId', '$event'] }
        }
      },
      {
        $group: {
          _id: '$effectiveEventId',
          registered: { $sum: 1 },
          attended: {
            $sum: {
              $cond: [{ $eq: ['$attendanceStatus', 'Attended'] }, 1, 0]
            }
          }
        }
      }
    ]);

    const summaryMap = new Map(
      registrationSummary.map((item) => [item._id.toString(), item])
    );

    const eventRows = events.map((event) => {
      const summary = summaryMap.get(event._id.toString());
      const registered = summary?.registered || 0;
      const attended = summary?.attended || 0;

      return buildAdminEventSummaryRow(event, { registered, attended });
    });

    return res.json({
      success: true,
      message: 'QR event summary retrieved successfully',
      data: eventRows
    });
  } catch (err) {
    console.error('Get Admin QR Event Summary Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while retrieving QR event summary',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

module.exports = {
  registerForEvent,
  getMyEventQr,
  scanAndCheckIn,
  updateCheckInStatus,
  getEventAttendanceTable,
  deleteRegistration,
  getAdminQrEventSummary,
  getMyRegistrations
};
