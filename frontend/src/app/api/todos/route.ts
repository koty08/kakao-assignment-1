import { NextResponse } from "next/server";
import { backendApi } from "@/lib/backend";
import type { Todo } from "@/types/todo";

/**
 * API Route: GET /api/todos?filter=all|active|completed&search=키워드
 * - 브라우저의 Todo 목록 요청을 받아 FastAPI 백엔드(/todos)로 프록시한다.
 * - filter/search 쿼리 파라미터를 그대로 백엔드에 전달해 서버에서 필터링/검색을 수행한다.
 * - 클라이언트가 백엔드를 직접 호출하지 않게 해, 백엔드 주소를 서버에 숨긴다(BFF).
 */
export async function GET(request: Request) {
  // 요청 URL에서 filter/search 값을 추출
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "all";
  const search = searchParams.get("search") ?? "";

  try {
    const { data } = await backendApi.get<Todo[]>("/todos", {
      params: { filter, search },
    });
    return NextResponse.json(data);
  } catch {
    // 백엔드 호출 실패 시 502로 응답 (Tanstack Query의 에러 처리로 이어짐)
    return NextResponse.json(
      { message: "Todo 목록을 불러오지 못했습니다." },
      { status: 502 },
    );
  }
}
