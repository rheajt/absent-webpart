export interface Absence {
  "@odata.type": string;
  "@odata.id": string;
  "@odata.etag": string;
  "@odata.editLink": string;
  Date: string;
  ReturnDate: string;
  "Faculty@odata.navigationLink": string;
  Faculty: {
    "@odata.type": string;
    "@odata.id": string;
    Title: string;
  };
  "Coverage@odata.navigationLink": string;
  Coverage: [
    {
      "@odata.type": string;
      "@odata.id": string;
      Title: string;
    }
  ];
}
