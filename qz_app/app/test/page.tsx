'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TestComponent = () => {
    const [borderColor, setBorderColor] = useState("");
    const [hoverColor, setHoverColor] = useState("");   
    const [bgColor, setBgColor] = useState("");
    const [textColor, setTextColor] = useState("");

    const handleClick_1 = () => {
        setBorderColor("border-green-500");
        setHoverColor("hover:bg-green-200");
    };
    
    const handleClick_2 = () => {
        setHoverColor("hover:bg-emerald-100 hover:text-emerald-600");
        setBgColor("bg-emerald-50");
        setTextColor("text-emerald-600");
    };
    const handleClick_3 = () => {
        setHoverColor("hover:bg-red-200 hover:text-red-600");
        setBgColor("bg-red-100");
        setTextColor("text-red-600");
    };

    const handleReset = () => {
        setBorderColor("");
        setHoverColor("");
        setBgColor("");
        setTextColor("");
    };

    return (
        <div className="flex flex-col gap-4 m-4">
            <h1>Test Component</h1>
            <p>This is a test component.</p>
            <Button 
                variant="ghost" 
                className={`border-2 border-gray-400 ${borderColor}  ${hoverColor}`} 
                onClick={handleClick_1}
            >
                hello
            </Button>
            <Button 
                variant="ghost" 
                className={`text-base  ${hoverColor} ${bgColor} ${textColor}`} 
                onClick={handleClick_2}
            >
                Correct
            </Button>
            
            <Button 
                variant="ghost" 
                className={`text-base  ${hoverColor} ${bgColor} ${textColor}`} 
                onClick={handleClick_3}
            >
                Incorrect
            </Button>
            <Button 
                variant="ghost" 
                className="border-2 border-gray-400" 
                onClick={handleReset}
            >
                Reset
            </Button>
        </div>
    );
};

export default TestComponent;
