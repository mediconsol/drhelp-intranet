import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// date-fns 제거됨 - JavaScript 내장 메서드 사용
import { CalendarIcon, Plus, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { CreateTicketForm } from "@/types";
import { supabase } from "@/lib/supabase";

interface CreateTicketDialogProps {
  onTicketCreate?: (ticket: CreateTicketForm) => void;
}

export default function CreateTicketDialog({ onTicketCreate }: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
    assignee: "",
    dueDate: undefined as Date | undefined,
  });
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const priorities = [
    { value: "high", label: "높음" },
    { value: "medium", label: "중간" },
    { value: "low", label: "낮음" },
  ];

  const categories = [
    { value: "시스템", label: "시스템" },
    { value: "보안", label: "보안" },
    { value: "디자인", label: "디자인" },
    { value: "성능", label: "성능" },
    { value: "기타", label: "기타" },
  ];

  // 사용자 목록 가져오기
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      console.log('🔄 Fetching users for assignee dropdown...');

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching users:', error);
        toast({
          title: "오류",
          description: "사용자 목록을 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Users fetched for dropdown:', data?.length || 0, 'users');
      setUsers(data || []);
    } catch (error) {
      console.error('❌ Exception while fetching users:', error);
      toast({
        title: "오류",
        description: "사용자 목록을 불러오는 중 예외가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 목록 가져오기
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priority || !formData.category || !formData.assignee) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "제목, 설명, 우선순위, 카테고리, 담당자는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    const newTicket: CreateTicketForm = {
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assignee: formData.assignee || "선택",
      reporter: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "현재사용자",
      due_date: formData.dueDate ? formData.dueDate.toISOString().split('T')[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: formData.category,
    };

    onTicketCreate?.(newTicket);
    setOpen(false);
    setFormData({
      title: "",
      description: "",
      priority: "",
      category: "",
      assignee: "",
      dueDate: undefined,
    });

    toast({
      title: "티켓이 생성되었습니다",
      description: `${newTicket.id} 티켓이 성공적으로 생성되었습니다.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          새 티켓 생성
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 업무 티켓 생성</DialogTitle>
          <DialogDescription>
            새로운 업무 요청을 등록하세요. 모든 필수 항목을 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="티켓 제목을 입력하세요"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명 *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="업무 내용을 상세히 설명해주세요"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>우선순위 *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="우선순위 선택" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>담당자 *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fetchUsers}
                disabled={loadingUsers}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${loadingUsers ? 'animate-spin' : ''}`} />
                새로고침
              </Button>
            </div>
            <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
              <SelectTrigger>
                <SelectValue placeholder={loadingUsers ? "사용자 목록 로딩중..." : "담당자 선택"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="선택">선택</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </SelectItem>
                ))}
                {users.length === 0 && !loadingUsers && (
                  <SelectItem value="" disabled>
                    등록된 사용자가 없습니다
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>마감일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    formData.dueDate.toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  ) : (
                    <span>마감일을 선택하세요 (선택사항)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit">
              티켓 생성
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}