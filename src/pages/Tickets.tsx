import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Filter, 
  Search,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  MessageSquare
} from "lucide-react";

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState("");

  const tickets = [
    {
      id: "TK-001",
      title: "서버 점검 일정 조율 및 시스템 백업",
      description: "월례 서버 점검을 위한 일정 조율과 데이터 백업 프로세스 수립이 필요합니다.",
      status: "진행중",
      priority: "높음",
      assignee: "김개발",
      reporter: "이팀장",
      createdAt: "2024-07-15",
      dueDate: "2024-07-17",
      comments: 5,
      category: "시스템"
    },
    {
      id: "TK-002", 
      title: "환자 데이터 백업 시스템 구축",
      description: "환자 정보 보안을 위한 자동 백업 시스템 구축 및 테스트가 필요합니다.",
      status: "검토중",
      priority: "중간",
      assignee: "이시스템",
      reporter: "박부장",
      createdAt: "2024-07-14",
      dueDate: "2024-07-20",
      comments: 3,
      category: "보안"
    },
    {
      id: "TK-003",
      title: "모바일 앱 UI 개선 작업",
      description: "사용자 경험 향상을 위한 모바일 애플리케이션 인터페이스 개선이 필요합니다.",
      status: "대기",
      priority: "낮음",
      assignee: "박디자인",
      reporter: "최기획",
      createdAt: "2024-07-13",
      dueDate: "2024-07-25",
      comments: 1,
      category: "디자인"
    },
    {
      id: "TK-004",
      title: "데이터베이스 성능 최적화",
      description: "쿼리 성능 개선 및 인덱스 최적화를 통한 데이터베이스 성능 향상이 필요합니다.",
      status: "완료",
      priority: "중간",
      assignee: "정DBA",
      reporter: "김개발",
      createdAt: "2024-07-10",
      dueDate: "2024-07-15",
      comments: 8,
      category: "성능"
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
      case "완료": return "bg-success text-success-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "진행중": return Activity;
      case "검토중": return Clock;
      case "대기": return AlertCircle;
      case "완료": return CheckCircle;
      default: return Activity;
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ticketsByStatus = {
    all: filteredTickets,
    active: filteredTickets.filter(t => ["진행중", "검토중", "대기"].includes(t.status)),
    completed: filteredTickets.filter(t => t.status === "완료"),
    overdue: filteredTickets.filter(t => new Date(t.dueDate) < new Date() && t.status !== "완료")
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">업무 티켓</h1>
          <p className="text-muted-foreground mt-1">업무 요청 및 진행 상황을 관리하세요</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 티켓 생성
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="티켓 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                필터
              </Button>
              <Button variant="outline" size="sm">
                정렬
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            전체 ({ticketsByStatus.all.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            진행중 ({ticketsByStatus.active.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            완료 ({ticketsByStatus.completed.length})
          </TabsTrigger>
          <TabsTrigger value="overdue">
            지연 ({ticketsByStatus.overdue.length})
          </TabsTrigger>
        </TabsList>

        {/* Ticket Lists */}
        {Object.entries(ticketsByStatus).map(([key, tickets]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            {tickets.map((ticket) => {
              const StatusIcon = getStatusIcon(ticket.status);
              return (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs font-mono">
                            {ticket.id}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {ticket.status}
                          </Badge>
                          <Badge variant="secondary">
                            {ticket.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg mb-2">{ticket.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {ticket.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>담당: {ticket.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>마감: {ticket.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{ticket.comments}개 댓글</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        작성: {ticket.reporter} • {ticket.createdAt}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            {tickets.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">티켓이 없습니다</p>
                    <p className="text-sm">새로운 티켓을 생성해보세요.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}