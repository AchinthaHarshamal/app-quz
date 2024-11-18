'use client';
import { Button } from "@/components/ui/button";
import { useState } from "react";

const TestComponent = () => {
    const [boderColor, setBorderColor] = useState("");
    const [hoverColor, setHoverColor] = useState("");   

    const handleClick = () => {
        setBorderColor("border-green-500");
        setHoverColor("hover:bg-green-200");
    };

    return (
        <div className="flex flex-col gap-4 m-4">
            <h1>Test Component</h1>
            <p>This is a test component.</p>
            <Button 
                variant="ghost" 
                className={`border-2 border-gray-400 ${boderColor}  ${hoverColor}`} 
                onClick={handleClick}
            >
                hello
            </Button>
        </div>
    );
};

export default TestComponent;
