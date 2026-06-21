import axios from "axios";

/**
 * FastAPI 백엔드와 통신하는 axios 인스턴스.
 * - 서버 측(API Route, Server Action, Server Component)에서만 사용한다.
 *   → 백엔드 주소가 브라우저에 노출되지 않아 BFF(백엔드 프록시) 구조가 된다.
 * - 주소는 환경변수 BACKEND_URL로 덮어쓸 수 있고, 기본값은 로컬 개발 서버다.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});
