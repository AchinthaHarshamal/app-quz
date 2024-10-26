'use client';
import uploadFile from "@/actions/uploadFile";



export default function Home() {
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await uploadFile(formData);
    if (result instanceof Error) {
      console.log(result.message);
    } else {
      console.log('File uploaded successfully');
    }
  };

  return (
    <div>
      <h1>Upload file</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit" value="Upload">Upload</button>
      </form>
    </div>
  )
}
