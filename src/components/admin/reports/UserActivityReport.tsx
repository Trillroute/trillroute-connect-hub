
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
        <CardHeader>
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
                <div>
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <BarChart className="w-5 h-5 text-music-500" />
                    Activity by Type
                  </div>
                  <ReBarChart
                    data={Object.entries(actionsSummary).map(([action, count]) => ({ action, count }))}
                    index="action"
                    categories={["count"]}
                    colors={["music.500"]}
                    className="h-52"
                  />
                </div>
                {/* Chart: Actions by User */}
                <div>
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <User className="w-5 h-5 text-music-500" />
                    Activity by User
                  </div>
                  <ReBarChart
                    data={userSummary.map(u => ({ user: u.user_name, count: u.count }))}
                    index="user"
                    categories={["count"]}
                    colors={["music.300"]}
                    className="h-52"
                  />
                </div>
              </div>

              {/* Table of recent activity */}
              <div className="overflow-x-auto mt-4">
                <div className="mb-2 flex items-center gap-2 font-semibold">
                  <Activity className="w-5 h-5 text-music-500" />
                  Recent Activity (showing last {logs.length} actions)
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Component/Page</TableHead>
                      <TableHead>Date/Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <span className="font-medium">
                            {userMap[log.user_id] || log.user_id}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="">{log.action}</span>
                        </TableCell>
                        <TableCell>
                          <span>{log.component || log.page_url}</span>
                        </TableCell>
                        <TableCell>
                          <span className="whitespace-nowrap">
                            {format(new Date(log.created_at), "yyyy-MM-dd, hh:mm:ss a")}
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserActivityReport;
