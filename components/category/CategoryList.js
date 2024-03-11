// "use client";

// import { useEffect } from "react";
// import { useCategory } from "@/context/category";

// to create or update or delete category
// export default function CategoryList() {
//   //context
//   const {
//     categories,
//     fetchCategories,
//     setUpdatingCategory, // when you clicked it, it can be updatingCategory state
//   } = useCategory();

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="my-5">
//       {categories?.map((c) => (
//         <button className="btn" onClick={() => setUpdatingCategory(c)}>
//           {c.name}
//         </button>
//       ))}
//     </div>
//   );
// }

//----------------------------------------------

"use client";
import { useEffect } from "react";
import { useCategory } from "@/context/category";

export default function CategoryList() {
  const { fetchCategories, categories, setUpdatingCategory } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-5">
      {categories?.map((c) => (
        <button className="btn" onClick={() => setUpdatingCategory(c)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
