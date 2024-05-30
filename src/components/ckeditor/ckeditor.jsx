import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./styles.css";

function CkEditorComp(props) {
  const API_URL = "https://deividcuello.pythonanywhere.com";
  const UPLOAD_ENDPOINT = "api/uploadadapter/";

  const [text, setText] = useState("");

  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then((file) => {
            body.append("uploadImg", file);
            fetch(`${API_URL}/${UPLOAD_ENDPOINT}`, {
              method: "post",
              body: body,
            }).then(
              ((res) => res.json())
            ).then((res) => {
              resolve({ default: `${API_URL}${res.image}` });
            })
            .catch((err) => {
              reject(err);
            });
          });
        });
      },
    };
  }

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  return (
    <div className="App">
      <div className="editor">
        <CKEditor
          config={{
            extraPlugins: [uploadPlugin],
          }}
          editor={ClassicEditor}
          id="header"
          data={props.description}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setText(data);
          }}
        />
      </div>
    </div>
  );
}

export default CkEditorComp;
