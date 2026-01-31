import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

type ParamsPromise = Promise<{ id: string }>;

export default async function EditPage({ params }: { params: ParamsPromise }) {
  // ① params を await して id を取り出す
  const { id } = await params;

  // ② DBから1件取る
  const post = await prisma.post.findUnique({ where: { id } });

  // ③ なければ表示
  if (!post) {
    return <div className="p-6">not found</div>;
  }

  // ④ フォームへ渡す
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">編集</h1>
      <EditForm post={post} />
    </div>
  );
}
