"use client";

import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { CircleStackIcon } from "@heroicons/react/24/outline";

interface JobTimelineProps {
  status: number; // 0=pending, 1=accepted, 2=completed, 3=paid, 4=cancelled
  createdAt: bigint;
  completedAt?: bigint;
  txHash?: string;
}

export default function JobTimeline({
  status,
  createdAt,
  completedAt,
  txHash,
}: JobTimelineProps) {
  const steps = [
    { label: "Created", value: 0, icon: CircleStackIcon },
    { label: "Accepted", value: 1, icon: CheckCircleIcon },
    { label: "Completed", value: 2, icon: CheckCircleIcon },
    { label: "Paid", value: 3, icon: CheckCircleIcon },
  ];

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getStepStatus = (stepValue: number) => {
    if (status === 4) return "cancelled"; // Cancelled
    if (status >= stepValue) return "completed";
    if (status === stepValue - 1) return "current";
    return "pending";
  };

  return (
    <div className="w-full py-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Job Progress</h3>
        {txHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View Transaction →
          </a>
        )}
      </div>

      {/* Status Badge */}
      {status === 4 && (
        <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
          <p className="text-red-800 font-medium">⚠️ Job Cancelled</p>
        </div>
      )}

      {/* Timeline Steps */}
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />

        {/* Progress Bar Fill */}
        <div
          className={`absolute top-5 left-0 h-0.5 transition-all duration-500 ${status === 4 ? "bg-red-500" : "bg-green-500"
            }`}
          style={{ width: `${(Math.min(status, 3) / 3) * 100}%` }}
        />

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepStatus = getStepStatus(step.value);
            const Icon = step.icon;

            return (
              <div key={step.label} className="flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${stepStatus === "completed"
                      ? "bg-green-500 text-white"
                      : stepStatus === "current"
                        ? "bg-blue-500 text-white animate-pulse"
                        : stepStatus === "cancelled"
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                >
                  {stepStatus === "completed" || stepStatus === "cancelled" ? (
                    <Icon className="w-6 h-6" />
                  ) : stepStatus === "current" ? (
                    <ClockIcon className="w-6 h-6" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                  )}
                </div>

                {/* Label */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${stepStatus === "completed" || stepStatus === "current"
                        ? "text-gray-900"
                        : "text-gray-400"
                      }`}
                  >
                    {step.label}
                  </p>

                  {/* Timestamp */}
                  {step.value === 0 && createdAt && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(createdAt)}
                    </p>
                  )}
                  {step.value === 2 && completedAt && status >= 2 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(completedAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Current Status</p>
            <p className="font-medium text-gray-900">
              {status === 0
                ? "Pending Acceptance"
                : status === 1
                  ? "Accepted - In Progress"
                  : status === 2
                    ? "Completed - Awaiting Payment"
                    : status === 3
                      ? "Paid & Rated"
                      : "Cancelled"}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Created</p>
            <p className="font-medium text-gray-900">
              {formatTimestamp(createdAt)}
            </p>
          </div>
        </div>

        {/* Dispute Window Warning */}
        {status === 2 && completedAt && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⏰ Client has 7 days to release payment. After that, provider can
              auto-claim funds.
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Deadline:{" "}
              {formatTimestamp(completedAt + BigInt(7 * 24 * 60 * 60))}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
