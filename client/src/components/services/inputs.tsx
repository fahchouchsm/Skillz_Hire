import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import Input1 from "./input1";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface input {}

const Input: React.FC<input> = () => {
  return (
    <ScrollArea className="h-full w-full rounded-md border">
      <div className="flex flex-col">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Create project</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input1 />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default Input;
