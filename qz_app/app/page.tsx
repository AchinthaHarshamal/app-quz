"use client";
export default function Home() {
  
  const onButtonClick = () => {
    console.log('Button Clicked')
  }
  return (
    <div>
      <button onClick={onButtonClick}>Click me</button>
    </div>
  )
}
