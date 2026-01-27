import { google } from "googleapis";

type SheetForm = {
  title: string;
  video_link: string;
};

export default async function sheetHandler(body: SheetForm) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/drive.file",
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  const sheets = google.sheets({ auth, version: "v4" });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "A1:B1",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[body.title, body.video_link]],
    },
  });

  return response.data;
}
