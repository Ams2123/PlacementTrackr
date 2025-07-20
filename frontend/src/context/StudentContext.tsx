import { createContext, useContext, useState, useEffect } from 'react';

type StudentContextType = {
  studentId: string | null;
  setStudentId: (id: string) => void;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: React.ReactNode }) => {
  const [studentId, setStudentIdState] = useState<string | null>(() => {
    return localStorage.getItem('studentId');
  });

  const setStudentId = (id: string) => {
    setStudentIdState(id);
    localStorage.setItem('studentId', id);
  };

  return (
    <StudentContext.Provider value={{ studentId, setStudentId }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};