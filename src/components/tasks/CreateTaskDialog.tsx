import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/hooks/useTasks";

interface TaskFormData {
  title: string;
  description: string;
  priority: string;
  assignee: string;
  due_date: Date | undefined;
  category: string;
}

export default function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "",
    assignee: "",
    due_date: undefined,
    category: "",
  });

  const { toast } = useToast();
  const { createTask } = useTasks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.priority || !formData.category) {
      toast({
        title: "필수 항목을 입력해주세요",
        description: "제목, 설명, 우선순위, 카테고리는 필수 입력 항목입니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        assignee: formData.assignee || null,
        due_date: formData.due_date ? formData.due_date.toISOString() : null,
        category: formData.category,
        status: "pending"
      });

      // 폼 초기화
      setFormData({
        title: "",
        description: "",
        priority: "",
        assignee: "",
        due_date: undefined,
        category: "",
      });

      setOpen(false);
      
      toast({
        title: "업무가 등록되었습니다",
        description: "새로운 업무가 성공적으로 등록되었습니다.",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "오류",
        description: "업무 등록 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          새 업무 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>새 업무 등록</DialogTitle>
          <DialogDescription>
            새로운 업무를 등록하여 팀과 공유하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              placeholder="업무 제목을 입력하세요"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="description">설명 *</Label>
            <Textarea
              id="description"
              placeholder="업무에 대한 상세한 설명을 입력하세요"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 우선순위 */}
            <div className="space-y-2">
              <Label>우선순위 *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="우선순위 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">높음</SelectItem>
                  <SelectItem value="medium">보통</SelectItem>
                  <SelectItem value="low">낮음</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 카테고리 */}
            <div className="space-y-2">
              <Label>카테고리 *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">개발</SelectItem>
                  <SelectItem value="design">디자인</SelectItem>
                  <SelectItem value="planning">기획</SelectItem>
                  <SelectItem value="testing">테스트</SelectItem>
                  <SelectItem value="maintenance">유지보수</SelectItem>
                  <SelectItem value="meeting">회의</SelectItem>
                  <SelectItem value="documentation">문서화</SelectItem>
                  <SelectItem value="other">기타</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 담당자 */}
            <div className="space-y-2">
              <Label htmlFor="assignee">담당자</Label>
              <Input
                id="assignee"
                placeholder="담당자 이름 (선택사항)"
                value={formData.assignee}
                onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              />
            </div>

            {/* 마감일 */}
            <div className="space-y-2">
              <Label>마감일</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? (
                      format(formData.due_date, "PPP", { locale: ko })
                    ) : (
                      "마감일 선택 (선택사항)"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                    initialFocus
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit">
              업무 등록
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
