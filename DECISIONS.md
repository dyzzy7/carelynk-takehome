# What I built
I built an API to upload worker-entered data and supporting documents, and verify the data they submitted against the documents. There are two major endpoints:
1. `/api/docs/upload` which is used to upload a zip file containing a `.csv` of worker-entered data and a `documents` folder of supporting documents for each worker.
2. `/api/workers/verify` which is used to verify data each worker entered against the data in the documents.

In the database, I have the following tables:
1. `workers` - for info entered by workers.
2. `cprCertification` - for info parsed from CPR Certification documents.
3. `criminalRecordChecks` - for info parsed from Criminal Record Check documents.
4. `immunizationRecords` - for info parsed from Immunization Record documents.
5. `nursingLicenses` - for info parsed from Nursing License documents.
6. `photoIds` for info parsed from Photo ID documents.
7. `workPermits` for info parsed from Work Permit documents.
8. `errors` for errors found in data or documents.

The workflow is like so:
1. User uploads file to `api/docs/upload`.
  a. Backend unzips file.
  b. Backend parses `csv` and uploads fields to database.
  c. Backend parses each `pdf` file and uploads fields to database. Most fields from the pdf are named the same in the db, but some are renamed. I wrote a mapping in `consts` to do this.
  d. If any files are missing or unreadable, endpoint will also return that info to the user and upload errors to database.
2. User then calls `/api/workers/validate`.
  a. Backend will first pull all existing errors from database.
  b. Then, for each worker and each doc, backend will call a validator to validate the data entered against the data in the doc.
  c. If no errors are found for a doc, backend will report that the document was successfully validated.
  d. If any errors are found for a doc, backend will return what errors were found.

To do this, I wrote validators for each document type, as well as some generic validators such as date checks.

# What I deliberately did not build
1. Implementing an OCR for pdf reading, because I didn't realize at first that some files would be scans, and not parsable via a normal parser. Once I realized that, I figured I wouldn't have time to do so atm.
2. Less rigid pdf fields definitions, because the given documents were all in the same format. I had an idea that AI might be helpful here, but I don't have enough experience with AI and wasn't confident I could do this in time. And again, all the documents for this exercise were in the same format, so I thought it was unnecessary here.
3. Error-handling and tests, again because of time pressure. I would definitely do this given more time.

# What I'd do with another week
1. Build a frontend, so that this could be usable by people who aren't tech-savvy.
2. Make error messages more meaningful (eg. say exactly what info is incorrect).
3. Add tests and error-handling.