
export const isDateInPeriod = (dateStr: string, period: string): boolean => {
  if (!dateStr || dateStr === 'Desconhecido') return false;
  
  // Parse Brazilian date format (dd/mm/yyyy)
  const dateParts = dateStr.split('/');
  if (dateParts.length !== 3) return false;
  
  const contactDate = new Date(
    parseInt(dateParts[2]), // year
    parseInt(dateParts[1]) - 1, // month (0-indexed)
    parseInt(dateParts[0]) // day
  );
  
  if (isNaN(contactDate.getTime())) return false;
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'day':
      const contactDay = new Date(contactDate.getFullYear(), contactDate.getMonth(), contactDate.getDate());
      return contactDay.getTime() === today.getTime();
    
    case 'week':
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 7);
      return contactDate >= weekAgo && contactDate <= now;
    
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);
      return contactDate >= monthAgo && contactDate <= now;
    
    case 'older':
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      return contactDate < thirtyDaysAgo;
    
    default:
      return true;
  }
};

export const getDateFilterPeriod = (filter: string): { startDate: Date; endDate: Date } => {
  const now = new Date();
  const endDate = new Date(now);
  let startDate: Date;

  switch (filter) {
    case 'day':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      break;
    default:
      startDate = new Date(0); // No filter, include all
  }

  return { startDate, endDate };
};
