// 템플릿 ─ 어떤 페이지든 복사해서 붙여넣기
export const metadata = { title: '준비중' };

export default function Placeholder() {
  return (
    <main className="flex h-screen items-center justify-center">
      <p className="text-xl text-muted-foreground">준비 중입니다 🚧</p>
    </main>
  );
}
