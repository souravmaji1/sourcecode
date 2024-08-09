const { google } = require('googleapis');

// Provide the required configuration

const calendarId = 'majisourav810@gmail.com';

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: 'v3' });

const auth = new google.auth.JWT(
  'souraa@albertreal.iam.gserviceaccount.com',
  null,
  '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDisTkMue87tpot\nHEtoSUJQ8UqNyE06HUZLoLEb1u8Xbh8WVXy2LxSh1UvxCelVGJMsgCcKPH5pg1Oi\nXtSVUoonpekw4G9LVmrsGM8tWOs4Sa9J7Bu1mlf0B9I7tdBjes8iWnt6h5DeBsSU\nxgEQv9PSd1OJuqb6Oam1VL7YUJwEMngVxHzAMmiX1u/TXRa4QNlP0Y2E77q4ug8o\nve2AdObdzwUuU0Sl9RAx5qvN8wXoHR52sMtsfzQNVuob/4BsTLUuSxiULMHklOa8\nPAsgg8LcYNMh3AenG1YY4Ikg/xs0P2UWTrscnhdlwGN7R3k1u8r3xYhhO6mEJ6U3\nr6ELjmtTAgMBAAECggEAAaXxOL73VtNOjqpof/McaNNATASbTyNcWftqnj2zUlPK\nJRLtC7QO7dhLq457ZFN/6nBqGEB1WNYMGx+eYxGNEJm7ts/C72TK9Tl+9CDz4N5k\nSGDPmMPtBMizxhxdzgNcEy9eO3dV3c9lyYEhC9qhMyQL9vHk+efGbJuXoaIAaGVk\nCZMigQSErRHMC20fG1OTefK9iN2wc301NODehJl7vbjiHqekd+BimNt2UyvmJoOe\nPA4UcFU7KD3vmVPgnPRFYA4DdXBvuCpjx6zYSfuaVK4xl0OsYVkAbEx2VGHe38Iy\n3eqU++yBfBbV87ab8O4pHr6Hy8eM6o0pCHze4nj1gQKBgQD7CDEqJyiOpH+2TV9+\nghhmeyQKF7wI0AqSinddUas6yWjxMXjr0blA++m+wQGUZjMDMzYu67+5eT35KyNp\nMN5Hud6q2pfCSbxYSeIKL3miuqs898/xbZ10WUGynyE2WIOprfsnwOUFrzo3U4Xj\nm5rw+kAIajlof1yamXWo2lEC0wKBgQDnLbfQO4t+TVg85UNrYQozJ0xHvA65EOTW\nj7qqQZdBl/VXH6IjXMYqac0DRk8FTFBRs5hunWZM7TskYBVW/KKh7iuuwfc66pGr\nJ5tMhJKv9nKNlzxcl9e51KKHnW14iGudQnpPqVxxSubbAQqRSGlaccFhtlpCCdsd\nEtyOcC6lgQKBgQCSOJ1armCDZfI2IC+FowXPe97sOhL/Fx9xaFJK+y1AGt2T0Htc\n8VZ1Mcdfo1DmPfls3cGr5wpQYPzmTGhd92ciZHP9FULcmtKoorCVuj2huhXQd5Ca\nUn0qrmsEPoi7/ScECSGIcGV2wDCq1W3hvFuuDjaKMEWsRrOMIeNVLYWOnQKBgQCA\nMdP6fuqNsWo66o+GXht/3kzogppPedTMPouumgy8bP25wGry3SFup5juNfDf6T+o\n7sSaomH2Sp8/PqDWyeWNkjta/2iPnUAF/0KZHfMR7MH9Tl5EolcYT5eJSH1KF6xF\nWnXk8u+2S2jVDTDE+7igVPB9tNc8Q6bj6m+v9PmJAQKBgG/Zp7RsCBmYisU0M6H8\n1AMSOzJ3yFJIMHFaDuhvuTPDNYsdCf3OEih5PdyG8oxdcNtsd+hpBSI4lU1KcUDW\n5VKze8tb+pxDyvPEQ7Wo899Pw3Mrczp1NMfTDSyDy2EwpOOrANZNqzUxglvbptcK\nsJ7L49FzMe5z3K7f5MAhvwyI\n-----END PRIVATE KEY-----\n',
  SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '+05:30';

// Get date-time string for calender
const dateTimeForCalander = () => {
  let date = new Date();

  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = `0${month}`;
  }
  let day = date.getDate();
  if (day < 10) {
    day = `0${day}`;
  }
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

  let event = new Date(Date.parse(newDateTime));

  let startDate = event;
  // Delay in end time is 1
  let endDate = new Date(
    new Date(startDate).setHours(startDate.getHours() + 1)
  );

  return {
    start: startDate,
    end: endDate
  };
};

// Insert new event to Google Calendar
const insertEvent = async (event) => {
  try {
    let response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      resource: event
    });

    if (response['status'] == 200 && response['statusText'] === 'OK') {
      return response;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(`Error at insertEvent --> ${error}`);
    return 0;
  }
};

let dateTime = dateTimeForCalander();

// // Event for Google Calendar
let event = {
  summary: `This is the summary.`,
  description: `This is the description.`,
  start: {
    dateTime: dateTime['start'],
    timeZone: 'Asia/Kolkata'
  },
  end: {
    dateTime: dateTime['end'],
    timeZone: 'Asia/Kolkata'
  }
};

insertEvent(event)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });

// Get all the events between two dates
