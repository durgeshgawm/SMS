import React from "react";
import { LucideIcon, PlusCircle, CreditCard, BookOpen, AlertCircle, UserPlus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "@/lib/format";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "admission" | "payment" | "library" | "leave" | "exam" | "system";
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  const defaultActivities: ActivityItem[] = [
    {
      id: "act-1",
      title: "New Student Admitted",
      description: "Aanya Verma registered in Class 5-B.",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      type: "admission",
    },
    {
      id: "act-2",
      title: "Fee Payment Received",
      description: "Received ₹4,500 library fee from Rahul Sen.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      type: "payment",
    },
    {
      id: "act-3",
      title: "Book Issued",
      description: "'Advanced Mathematics' issued to Kabir Dev.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      type: "library",
    },
    {
      id: "act-4",
      title: "Teacher Leave Request",
      description: "Ms. Shalini Gupta applied for 2 days medical leave.",
      timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      type: "leave",
    },
  ];

  const list = activities || defaultActivities;

  const iconMap: Record<ActivityItem["type"], LucideIcon> = {
    admission: UserPlus,
    payment: CreditCard,
    library: BookOpen,
    leave: AlertCircle,
    exam: FileText,
    system: PlusCircle,
  };

  const colorMap: Record<ActivityItem["type"], string> = {
    admission: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    payment: "text-green-500 bg-green-500/10 border-green-500/20",
    library: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    leave: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    exam: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    system: "text-slate-500 bg-slate-500/10 border-slate-500/20",
  };

  return (
    <div className={cn("rounded-xl border border-border bg-card p-5 shadow-sm space-y-5", className)}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight text-foreground">Recent Activity</h3>
        <p className="text-xs text-muted-foreground">Real-time updates across departments</p>
      </div>

      <div className="flow-root">
        <ul className="-mb-8">
          {list.map((item, itemIdx) => {
            const Icon = iconMap[item.type];
            return (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== list.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-border" aria-hidden="true" />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center ring-8 ring-card shrink-0",
                          colorMap[item.type]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div className="text-left">
                        <p className="text-xs font-semibold text-foreground leading-none">{item.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{item.description}</p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-muted-foreground font-medium pt-0.5">
                        {formatDistanceToNow(item.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
