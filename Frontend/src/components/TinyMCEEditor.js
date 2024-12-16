import React from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({ value, onChange }) => {
  return (
    <Editor
      value={value}
      onEditorChange={(content) => onChange({ target: { name: "description", value: content } })}
      init={{
        height: 300,
        menubar: false,
        plugins: ["advlist autolink lists link image charmap print preview anchor"],
        toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent",
      }}
    />
  );
};

export default TinyMCEEditor;
