const url = "https://api.cloudinary.com/v1_1/dduhbsxy4a/scrooble_avatars/image/upload";
const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const file = document.querySelector("#file");
  const formData = new FormData();


    formData.append("file", file);
    formData.append("upload_preset", "docs_upload_example_us_preset");

    fetch(url, {
      method: "POST",
      body: formData
    })
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        document.getElementById("data").innerHTML += data;
      });
});


