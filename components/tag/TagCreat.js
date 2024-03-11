"use client";

import { useTag } from "@/context/tag";
import { useCategory } from "@/context/category";
import { useEffect } from "react";

// to create or update or delete tag
export default function TagCreate() {
  //context
  const {
    name,
    setName,
    parentCategory,
    setParentCategory,
    tags,
    setTags,
    updatingTag,
    setUpdatingTag,
    createTag,
    fetchTags,
    updateTag,
    deleteTag,
  } = useTag();

  const { categories, fetchCategories } = useCategory();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="my-5">
      <input
        type="text"
        value={updatingTag ? updatingTag?.name : name}
        onChange={(e) => {
          if (updatingTag) {
            setUpdatingTag({ ...updatingTag, name: e.target.value });
          } else {
            setName(e.target.value);
          }
        }}
        className="form-control p-2 my-2"
      />

      <div className="form-group mt-4">
        <label>Parent categories</label>
        <select
          name="category"
          className="form-control"
          onChange={(e) =>
            updatingTag
              ? setUpdatingTag({
                  ...updatingTag,
                  parentCategory: e.target.value,
                }) // for update
              : setParentCategory(e.target.value) // for create
          }
        >
          <option>Select a category</option>
          {categories?.map((c) => (
            <option
              key={c._id}
              value={c._id} // _id: ObjectId('65af745b79ebc932faa968dc') goes to the api
              selected={
                c?._id === updatingTag?.parentCategory ||
                c?._id === parentCategory
              }
            >
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="d-flex justify-content-between">
        <button
          className={`btn bg-${updatingTag ? "info" : "primary"} text-light`}
          onClick={(e) => {
            e.preventDefault();
            updatingTag ? updateTag() : createTag();
          }}
        >
          {updatingTag ? "Update" : "Create"}
        </button>

        {updatingTag && (
          <>
            <button
              className={`btn bg-danger text-light`}
              onClick={(e) => {
                e.preventDefault();
                deleteTag();
              }}
            >
              Delete
            </button>

            <button
              className="btn bg-success text-light"
              onClick={() => setUpdatingTag(null)}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
