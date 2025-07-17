import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  assignee: string | null;
  due_date: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskForm {
  title: string;
  description: string;
  priority: string;
  assignee: string | null;
  due_date: string | null;
  category: string;
  status: string;
}

// 로컬 스토리지를 사용한 간단한 업무 관리
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 로컬 스토리지에서 업무 목록 불러오기
  const loadTasks = () => {
    try {
      const savedTasks = localStorage.getItem('dr-help-tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } else {
        // 초기 샘플 데이터
        const sampleTasks: Task[] = [
          {
            id: '1',
            title: '환자 관리 시스템 UI 개선',
            description: '환자 정보 입력 폼의 사용성을 개선하고 반응형 디자인을 적용합니다.',
            status: 'in_progress',
            priority: 'high',
            assignee: '김개발',
            due_date: '2024-07-25',
            category: 'development',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: '의료진 일정 관리 기능 추가',
            description: '의료진의 근무 일정과 휴가를 관리할 수 있는 캘린더 기능을 개발합니다.',
            status: 'pending',
            priority: 'medium',
            assignee: '이기획',
            due_date: '2024-08-01',
            category: 'planning',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: '데이터베이스 백업 시스템 점검',
            description: '정기적인 데이터베이스 백업이 정상적으로 작동하는지 점검합니다.',
            status: 'completed',
            priority: 'high',
            assignee: '박시스템',
            due_date: '2024-07-20',
            category: 'maintenance',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        setTasks(sampleTasks);
        localStorage.setItem('dr-help-tasks', JSON.stringify(sampleTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "오류",
        description: "업무 목록을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 로컬 스토리지에 업무 목록 저장
  const saveTasks = (updatedTasks: Task[]) => {
    try {
      localStorage.setItem('dr-help-tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast({
        title: "오류",
        description: "업무 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 새 업무 생성
  const createTask = async (formData: CreateTaskForm) => {
    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: formData.status as Task['status'],
        priority: formData.priority as Task['priority'],
        assignee: formData.assignee,
        due_date: formData.due_date,
        category: formData.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedTasks = [newTask, ...tasks];
      saveTasks(updatedTasks);

      toast({
        title: "성공",
        description: "새 업무가 등록되었습니다.",
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "오류",
        description: "업무 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 업무 상태 업데이트
  const updateTaskStatus = async (id: string, status: Task['status']) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, status, updated_at: new Date().toISOString() }
          : task
      );
      saveTasks(updatedTasks);

      const statusText = {
        pending: '대기',
        in_progress: '진행중',
        completed: '완료'
      }[status];

      toast({
        title: "상태 변경됨",
        description: `업무 상태가 "${statusText}"로 변경되었습니다.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "오류",
        description: "업무 상태 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 업무 수정
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updated_at: new Date().toISOString() }
          : task
      );
      saveTasks(updatedTasks);

      toast({
        title: "성공",
        description: "업무가 수정되었습니다.",
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "오류",
        description: "업무 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 업무 삭제
  const deleteTask = async (id: string) => {
    try {
      const updatedTasks = tasks.filter(task => task.id !== id);
      saveTasks(updatedTasks);

      toast({
        title: "성공",
        description: "업무가 삭제되었습니다.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "오류",
        description: "업무 삭제 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    createTask,
    updateTaskStatus,
    updateTask,
    deleteTask,
    refetch: loadTasks
  };
}
