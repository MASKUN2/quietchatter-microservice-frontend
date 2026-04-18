import BookSearch from "@/views/BookSearch";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookSearch />
    </Suspense>
  );
}
