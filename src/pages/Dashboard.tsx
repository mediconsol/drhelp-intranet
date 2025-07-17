import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReportGenerationDialog from "@/components/dashboard/ReportGenerationDialog";
// import CreateTicketDialog from "@/components/tickets/CreateTicketDialog"; // 제거됨
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  FileText, 
  Calendar, 
  MessageSquare, 
  Users,
  TrendingUp,
  AlertCircle,
  Plus
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "진행 중인 티켓",
      value: "24",
      change: "+12%",
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "완료된 작업",
      value: "156",
      change: "+8%",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      title: "금일 일정",
      value: "7",
      change: "+2",
      icon: Calendar,
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      title: "미읽은 공지",
      value: "3",
      change: "+1",
      icon: MessageSquare,
      color: "text-destructive",
      bgColor: "bg-destructive/10"
    }
  ];

  // recentTickets 제거됨

  const upcomingEvents = [
    {
      title: "월례 회의",
      time: "09:00",
      type: "회의",
      participants: 12
    },
    {
      title: "시스템 점검",
      time: "14:00",
      type: "점검",
      participants: 3
    },
    {
      title: "신규 직원 교육",
      time: "16:00",
      type: "교육",
      participants: 8
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음": return "bg-destructive text-destructive-foreground";
      case "중간": return "bg-warning text-warning-foreground";
      case "낮음": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "진행중": return "bg-primary text-primary-foreground";
      case "검토중": return "bg-warning text-warning-foreground";
      case "대기": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">대시보드</h1>
          <p className="text-muted-foreground mt-1">김안과21 인트라넷 현황</p>
        </div>
        <div className="flex gap-2">
          <ReportGenerationDialog />
          {/* CreateTicketDialog 제거됨 */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <Badge variant="outline" className={`${stat.color} border-current`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets 섹션 제거됨 */}

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              오늘의 일정
            </CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {event.time} • {event.type}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {event.participants}명 참여
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>빠른 작업</CardTitle>
          <CardDescription>
            자주 사용하는 기능들에 빠르게 접근하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* CreateTicketDialog 제거됨 */}
            <Button variant="outline" className="h-20 flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-sm">문서 업로드</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">일정 등록</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">공지 작성</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}