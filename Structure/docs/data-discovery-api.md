# Data Discovery API Contract

This document describes the frontend/backend contract for the Data Discovery feature (component: `DataDiscovery.tsx` and `ColumnDetail.tsx`). It lists endpoints the frontend expects, request/response shapes, example objects (mocks used in the UI), and fallbacks the frontend uses when the backend is not available.

## Summary

Data Discovery is a frontend-only view that renders details about a selected dataset (file) including: file metadata, columns list and connections, simple statistics, and a sample preview of data records. The frontend currently uses in-memory mock data from `UserContext` and deterministic pseudo-random values for column distributions inside `ColumnDetail`.

The backend should provide endpoints for retrieving file metadata, column-level statistics, connected dataset lookups, and preview records. The frontend will call these endpoints when available; if not, it will fallback to the mock data described below.

---

## Endpoints (recommended)

1) GET /api/files/:fileId
- Purpose: Fetch file metadata (name, size, uploadDate, rowCount, columns, databaseLink, relatedFiles)
- Frontend: Called when opening Data Discovery for a given fileId (optional: Dashboard already provides file object; still useful to refresh metadata)
- Request: URL path param only

Response (200):
{
  "id": "string",
  "name": "string",
  "size": number,            // bytes
  "uploadDate": "YYYY-MM-DD",
  "rowCount": number,
  "columns": ["col1", "col2", ...],
  "databaseLink": "https://..." | null,
  "relatedFiles": { "columnName": "relatedFileId", ... }
}

Example response:
{
  "id": "1",
  "name": "sales_data_q1.csv",
  "size": 2048000,
  "uploadDate": "2024-01-15",
  "rowCount": 15420,
  "columns": ["date","product_id","customer_id","revenue","quantity"],
  "databaseLink": "https://analytics.company.com/db/sales_q1",
  "relatedFiles": { "product_id": "4", "customer_id": "5" }
}

Fallback (frontend): uses the `FileData` object already present in `UserContext` (mock files list).

---

2) GET /api/files/:fileId/preview?limit=100
- Purpose: Return sample records for the file (tabular preview)
- Request query: `limit` optional (default 50)
- Response (200):
{
  "rows": [ { "col1": value, "col2": value, ... }, ... ],
  "columns": ["col1", "col2", ...],
  "total": number
}

Example response:
{
  "columns": ["id","timestamp","value","category","status"],
  "rows": [
    {"id":1, "timestamp":"2024-01-15 10:30:00","value":1250.75,"category":"Sales","status":"Complete"},
    {"id":2, "timestamp":"2024-01-15 10:31:00","value":856.20,"category":"Marketing","status":"Pending"}
  ],
  "total": 15420
}

Frontend fallback: uses `mockDataRecords` array defined in `DataDiscovery.tsx`.

---

3) GET /api/files/:fileId/columns/:columnName/stats
- Purpose: Return column-level statistics (unique count estimate, completeness, distribution samples)
- Response (200):
{
  "column": "string",
  "uniqueApprox": number,   // e.g. 1200
  "completeness": 0-100,    // percent
  "sampleDistribution": [0.1, 0.3, 0.2, ...]  // normalized samples for charting
}

Example response:
{
  "column": "revenue",
  "uniqueApprox": 3120,
  "completeness": 94.2,
  "sampleDistribution": [0.12,0.25,0.18,0.22,0.23,0.30]
}

Frontend fallback: `ColumnDetail` generates deterministic pseudo-random samples via `seededValues(column + file.id, count)`.

---

4) GET /api/files/:fileId/columns/:columnName/related
- Purpose: Ask backend for connected datasets referencing the same values for the column; returns list of related file metadata or ids
- Response (200):
{
  "column": "string",
  "relatedFiles": [ { file metadata objects } ]
}

Example response:
{
  "column": "product_id",
  "relatedFiles": [
    {"id":"4","name":"products_catalog.csv","columns":["product_id","name","category","price"], "databaseLink": "https://..."}
  ]
}

Frontend fallback: `DataDiscovery` reads `file.relatedFiles` mapping and uses `files` from `UserContext` to look up related `FileData` objects.

---

5) POST /api/files/:fileId/preview/export
- Purpose: Export a sample or full dataset for download (CSV or JSON). The frontend triggers this when user clicks Export.
- Request body (optional): {
  "format": "csv" | "json",
  "limit": number (optional)
}
- Response: File stream (Content-Type: text/csv or application/json)

Frontend fallback: No backend call — the frontend could construct and download a CSV from `mockDataRecords`.

---

## Frontend -> Backend payloads (what frontend sends)

1) Uploads (from `Home.tsx`)
- When uploading files from the Home page, frontend creates `FileData`-like metadata for mock usage and in real integration it should POST file contents using `multipart/form-data` to `/api/files/upload`.

Example request (multipart/form-data):
- Fields: file (binary), metadata (json)

Example response (200):
{
  "id": "generated-id",
  "name": "uploaded.csv",
  "size": 123456,
  "uploadDate": "2024-08-21",
  "rowCount": 1234,
  "columns": ["col1","col2"],
  "databaseLink": null,
  "relatedFiles": {}
}

2) Export (from DataDiscovery export button)
- See `POST /api/files/:fileId/preview/export` above. Request body indicates format and optional filters.

---

## Objects used by the frontend (types)

`FileData` (from `UserContext`)
```ts
interface FileData {
  id: string;
  name: string;
  size: number;
  uploadDate: string; // YYYY-MM-DD
  rowCount: number;
  columns: string[];
  databaseLink?: string;
  relatedFiles?: { [columnName: string]: string };
}
```

Example (mock used in `UserContext`):
```json
{
  "id": "1",
  "name": "sales_data_q1.csv",
  "size": 2048000,
  "uploadDate": "2024-01-15",
  "rowCount": 15420,
  "columns": ["date","product_id","customer_id","revenue","quantity"],
  "databaseLink": "https://analytics.company.com/db/sales_q1",
  "relatedFiles": { "product_id": "4", "customer_id": "5" }
}
```

`PreviewResponse` (preview endpoint)
```ts
interface PreviewResponse {
  columns: string[];
  rows: Array<Record<string, any>>;
  total: number;
}
```

Example (frontend `mockDataRecords`):
```json
{
  "columns": ["id","timestamp","value","category","status"],
  "rows": [
    {"id":1, "timestamp":"2024-01-15 10:30:00","value":1250.75,"category":"Sales","status":"Complete"},
    {"id":2, "timestamp":"2024-01-15 10:31:00","value":856.20,"category":"Marketing","status":"Pending"}
  ],
  "total": 15420
}
```

`ColumnStats` (column stats endpoint)
```ts
interface ColumnStats {
  column: string;
  uniqueApprox: number;
  completeness: number; // 0-100
  sampleDistribution: number[]; // normalized values
}
```

Example (generated in `ColumnDetail` using seededValues):
```json
{
  "column": "revenue",
  "uniqueApprox": 3120,
  "completeness": 94.2,
  "sampleDistribution": [0.12,0.25,0.18,0.22,0.23,0.30]
}
```

---

## Fallbacks & mocks used in the frontend

- `UserContext` seeds the app with a list of `FileData` mock objects (see `src/contexts/UserContext.tsx`). The Dashboard and DataDiscovery read from this context instead of fetching from a backend.
- `DataDiscovery.tsx` uses `mockDataRecords` (in-file array) for the table preview when a backend isn't available.
- `ColumnDetail.tsx` generates deterministic pseudo-random sample distributions with `seededValues(column + file.id)`.
- Several UI metrics in `DataDiscovery` use `Math.random()` initially; these should be replaced with deterministic stats from `/columns/:columnName/stats` when backend is ready.

---

## Integration notes / Best practices for backend

- Return stable column ordering in `columns` arrays; the frontend maps headers in the same order for previews.
- `relatedFiles` mapping should reference valid file ids; the frontend uses `UserContext.files` to resolve related file metadata.
- For large previews, implement pagination or a preview-only endpoint that returns a limited sample set.
- Provide CORS and proper auth headers if the frontend is served from a different origin.

---

## To-do for frontend integration

- Replace in-memory mocks with fetch calls to the endpoints above.
- Swap `Math.random()` placeholders with values from `GET /api/files/:fileId/columns/:columnName/stats`.
- Implement export endpoint consumption for CSV/JSON streaming.
- Add loading states and error handling for all network requests.

---

## Contact
For backend contract questions, attach examples from the `UserContext` and this doc. If you prefer, I can draft OpenAPI snippets for these endpoints.
