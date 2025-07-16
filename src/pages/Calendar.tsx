import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings
} from "lucide-react";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  const events = [
    {
      id: "1",
      title: "월례 회의",
      startTime: "09:00",
      endTime: "11:00",
      date: "2024-07-16",
      type: "회의",
      location: "회의실 A",
      participants: ["김팀장", "이개발", "박디자인"],
      description: "월례 진행상황 점검 및 계획 수립"
    },
    {
      id: "2",
      title: "시스템 점검",
      startTime: "14:00", 
      endTime: "16:00",
      date: "2024-07-16",
      type: "점검",
      location: "서버실",
      participants: ["정DBA", "김개발"],
      description: "정기 시스템 점검 및 성능 모니터링"
    },
    {
      id: "3",
      title: "신규 직원 교육",
      startTime: "16:00",
      endTime: "18:00", 
      date: "2024-07-16",
      type: "교육",
      location: "교육실",
      participants: ["최인사", "신입사원들"],
      description: "신규 입사자 대상 시스템 사용법 교육"
    },
    {
      id: "4",
      title: "고객 미팅",
      startTime: "10:00",
      endTime: "12:00",
      date: "2024-07-17",
      type: "미팅",
      location: "외부",
      participants: ["김팀장", "이영업"],
      description: "신규 프로젝트 관련 고객사 미팅"
    },
    {
      id: "5",
      title: "코드 리뷰",
      startTime: "15:00",
      endTime: "16:30",
      date: "2024-07-17",
      type: "리뷰",
      location: "개발실",
      participants: ["김개발", "이개발", "박개발"],
      description: "주간 코드 리뷰 및 품질 점검"
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "회의": return "bg-primary text-primary-foreground";
      case "점검": return "bg-warning text-warning-foreground";
      case "교육": return "bg-success text-success-foreground";
      case "미팅": return "bg-destructive text-destructive-foreground";
      case "리뷰": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const todayEvents = events.filter(event => event.date === "2024-07-16");
  const upcomingEvents = events.filter(event => new Date(event.date) > new Date("2024-07-16"));

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => 
        event.date === current.toISOString().split('T')[0]
      );
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">일정 관리</h1>
          <p className="text-muted-foreground mt-1">일정과 약속을 효율적으로 관리하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            설정
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            새 일정
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold">
                    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant={view === "month" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setView("month")}
                  >
                    월
                  </Button>
                  <Button 
                    variant={view === "week" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setView("week")}
                  >
                    주
                  </Button>
                  <Button 
                    variant={view === "day" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setView("day")}
                  >
                    일
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors
                      ${day.isCurrentMonth ? 'bg-background' : 'bg-muted/20'}
                      ${day.isToday ? 'ring-2 ring-primary bg-primary/5' : ''}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.events.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded truncate ${getEventTypeColor(event.type)}`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{day.events.length - 2}개 더
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                오늘의 일정
              </CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayEvents.map(event => (
                  <div key={event.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.startTime} - {event.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.participants.length}명 참여</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {todayEvents.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>오늘 일정이 없습니다</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>다가오는 일정</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.slice(0, 3).map(event => (
                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className="w-2 h-8 rounded-full bg-primary"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {event.date} • {event.startTime}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>빠른 작업</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  회의 일정 생성
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Filter className="h-4 w-4 mr-2" />
                  일정 필터링
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  알림 설정
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}