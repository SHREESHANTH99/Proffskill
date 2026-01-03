"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface VerifiedBadgeProps {
  hasCredential: boolean;
  skillName?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function VerifiedBadge({
  hasCredential,
  skillName,
  size = "md",
  showText = true,
}: VerifiedBadgeProps) {
  if (!hasCredential) return null;

  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-sm",
    lg: "w-6 h-6 text-base",
  };

  const iconSize = sizeClasses[size].split(" ")[0] + " " + sizeClasses[size].split(" ")[1];
  const textSize = sizeClasses[size].split(" ")[2];

  return (
    <span className={`inline-flex items-center gap-1 text-green-600 font-medium ${textSize}`}>
      <CheckCircleIcon className={iconSize} />
      {showText && (
        <span>
          {skillName ? `Verified: ${skillName}` : "Verified Skill NFT"}
        </span>
      )}
    </span>
  );
}
