
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { User, Activity, Calendar, BarChart } from "lucide-react";
import { AreaChart, BarChart as ReBarChart } from "@/components/ui/charts";
import { format } from "date-fns";

export interface UserLog {
  id: string;
  user_id: string;
  action: string;
  component: string | null;
  page_url: string | null;
  created_at: string;
}

export interface UserSummary {
  user_id: string;
  user_name: string;
  count: number;
}

const UserActivityReport: React.FC = () => {
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Fetch logs and minimal user info
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);

      // 1. Fetch activity logs (limit to recent 1000 for performance)
      const { data: logData, error: logError } = await supabase
        .from("user_activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      // 2. Fetch users referenced in logs
      const userIds = logData ? Array.from(new Set(logData.map(l => l.user_id))) : [];
      let userMap: Record<string, string> = {};
      if (userIds.length > 0) {
        const { data: usersData } = await supabase
          .from("custom_users")
          .select("id, first_name, last_name, email")
          .in("id", userIds);

        if (usersData) {
          usersData.forEach((u) => 
            { userMap[u.id] = `${u.first_name} ${u.last_name} (${u.email})` }
          );
        }
      }

      setLogs(logData || []);
      setUserMap(userMap);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  // Prepare action summary for chart
  const actionsSummary = logs.reduce<Record<string, number>>((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {});

  // Prepare user summary for chart
  const userSummary: UserSummary[] = Object.keys(userMap).map(uid => ({
    user_id: uid,
    user_name: userMap[uid],
    count: logs.filter(l => l.user_id === uid).length,
  }));

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Activity Overview</CardTitle>
          <CardDescription>Recent actions and tab clicks by all users</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              Loading activity logs...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Chart: Actions by Type */}
                <div className="bg-white p-4 rounded-lg border border-border">
                  <div className="mb-3 flex items-center gap-2 font-medium text-sm">
                    <BarChart className="w-5 h-5 text-music-500" />
                    <span>Activity by Type</span>
                  </div>
                  <div className="h-64">
                    <ReBarChart
                      data={Object.entries(actionsSummary).map(([action, count]) => ({ action, count }))}
                      index="action"
                      categories={["count"]}
                      colors={["music.500"]}
                      className="h-full"
                      valueFormatter={(value: number) => `${value} actions`}
                    />
                  </div>
                </div>
                
                {/* Chart: Actions by User */}
                <div className="bg-white p-4 rounded-lg border border-border">
                  <div className="mb-3 flex items-center gap-2 font-medium text-sm">
                    <User className="w-5 h-5 text-music-500" />
                    <span>Activity by User</span>
                  </div>
                  <div className="h-64 overflow-hidden">
                    <ReBarChart
                      data={userSummary.slice(0, 10).map(u => ({
                        user: u.user_name.split(' ')[0], // Just use first name to avoid overflow
                        count: u.count
                      }))}
                      index="user"
                      categories={["count"]}
                      colors={["music.300"]}
                      className="h-full"
                      valueFormatter={(value: number) => `${value} actions`}
                    />
                  </div>
                </div>
              </div>

              {/* Table of recent activity */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-border">
                <div className="mb-3 flex items-center gap-2 font-medium">
                  <Activity className="w-5 h-5 text-music-500" />
                  <span>Recent Activity (showing last {logs.length} actions)</span>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">User</TableHead>
                        <TableHead className="w-[150px]">Action</TableHead>
                        <TableHead className="w-[250px]">Component/Page</TableHead>
                        <TableHead className="w-[180px]">Date/Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="font-medium truncate max-w-[250px]" title={userMap[log.user_id] || log.user_id}>
                              {userMap[log.user_id] || log.user_id}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                              {log.action}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="truncate max-w-[250px]" title={log.component || log.page_url || ""}>
                              {log.component || log.page_url}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="whitespace-nowrap text-sm">
                              {format(new Date(log.created_at), "yyyy-MM-dd, hh:mm a")}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {logs.length === 0 && (
                    <div className="text-gray-500 text-sm p-4 text-center">No activity logs yet.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityReport;
