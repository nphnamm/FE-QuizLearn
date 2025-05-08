"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, BookOpen, Clock, Target } from "lucide-react";

interface HowToEarnStreakDialogProps {
  children: React.ReactNode;
}

export function HowToEarnStreakDialog({ children }: HowToEarnStreakDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flame className="text-orange-500" />
            How to Earn a Streak
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium">Complete Study Sessions</h4>
                <p className="text-sm text-gray-500">
                  Finish at least one study session per day to maintain your streak
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium">Daily Practice</h4>
                <p className="text-sm text-gray-500">
                  Practice every day to build your streak. Missing a day will reset your streak
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <h4 className="font-medium">Set Goals</h4>
                <p className="text-sm text-gray-500">
                  Set daily study goals to help maintain your streak and track your progress
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Pro Tips</h4>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• Study at the same time each day to build a habit</li>
              <li>• Set reminders to help you remember to study</li>
              <li>• Start with small goals and gradually increase them</li>
              <li>• Celebrate your streak milestones!</li>
            </ul>
          </div>
        </div>
      </DialogContent>
      
    </Dialog>
  );
} 