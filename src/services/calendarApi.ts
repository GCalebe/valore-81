
import { format, endOfDay } from 'date-fns';
import { toast } from "sonner";
import { CalendarEvent, EventFormData } from '@/types/calendar';

// API base URL
const API_BASE_URL = 'https://webhook.n8nlabz.com.br/webhook/agenda';

// Add retry mechanism for failed requests
const retryRequest = async (fn: () => Promise<any>, retries = 3): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.log(`Request failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      return retryRequest(fn, retries - 1);
    }
    throw error;
  }
};

// Fetch events with GET method
export async function fetchCalendarEvents(selectedDate?: Date | null) {
  const fetchWithRetry = () => {
    let url = API_BASE_URL;
    
    // If a date is selected, add query parameters for start and end dates
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000xxx");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999xxx");
      
      url += `?start=${encodeURIComponent(startDateTime)}&end=${encodeURIComponent(endDateTime)}`;
      console.log('Fetching events with date range:', { startDateTime, endDateTime });
    }
    
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  };

  try {
    const data = await retryRequest(fetchWithRetry);
    console.log('Successfully fetched calendar events:', data);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching calendar events after retries:', err);
    
    // Return empty array as fallback instead of throwing
    toast.error("Não foi possível carregar os eventos da agenda. Verifique sua conexão com a internet.");
    return [];
  }
}

// Refresh events with POST method
export async function refreshCalendarEventsPost(selectedDate?: Date | null) {
  const refreshWithRetry = () => {
    const payload: any = {};
    
    if (selectedDate) {
      const startDateTime = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000xxx");
      const endDateTime = format(endOfDay(selectedDate), "yyyy-MM-dd'T'23:59:59.999xxx");
      
      payload.start = startDateTime;
      payload.end = endDateTime;
      console.log('Refreshing events with payload:', payload);
    }
    
    return fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  };

  try {
    const data = await retryRequest(refreshWithRetry);
    console.log('Successfully refreshed calendar events:', data);
    toast.success("Eventos atualizados com sucesso!");
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error refreshing calendar events after retries:', err);
    toast.error("Não conseguimos atualizar os eventos. Verifique sua conexão e tente novamente.");
    throw err;
  }
}

// Add a new event
export async function addCalendarEvent(formData: EventFormData) {
  const addWithRetry = () => {
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log('Adding event with payload:', payload);
    
    return fetch(`${API_BASE_URL}/adicionar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  };

  try {
    await retryRequest(addWithRetry);
    toast.success("Evento adicionado com sucesso!");
    return true;
  } catch (err) {
    console.error('Error adding event after retries:', err);
    toast.error("Erro ao adicionar evento. Verifique sua conexão e tente novamente.");
    return false;
  }
}

// Edit an existing event
export async function editCalendarEvent(eventId: string, formData: EventFormData) {
  const editWithRetry = () => {
    const { date, startTime, endTime, summary, description, email } = formData;
    const dateStr = format(date, "yyyy-MM-dd");
    
    const startDateTime = `${dateStr}T${startTime}:00-03:00`;
    const endDateTime = `${dateStr}T${endTime}:00-03:00`;
    
    const payload = {
      id: eventId,
      summary,
      description,
      start: startDateTime,
      end: endDateTime,
      email
    };
    
    console.log('Updating event with payload:', payload);
    
    return fetch(`${API_BASE_URL}/alterar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  };

  try {
    await retryRequest(editWithRetry);
    toast.success("Evento atualizado com sucesso!");
    return true;
  } catch (err) {
    console.error('Error updating event after retries:', err);
    toast.error("Erro ao atualizar evento. Verifique sua conexão e tente novamente.");
    return false;
  }
}

// Delete an event
export async function deleteCalendarEvent(eventId: string) {
  const deleteWithRetry = () => {
    const payload = {
      id: eventId
    };
    
    console.log('Deleting event with payload:', payload);
    
    return fetch(`${API_BASE_URL}/excluir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  };

  try {
    await retryRequest(deleteWithRetry);
    toast.success("Evento excluído com sucesso!");
    return true;
  } catch (err) {
    console.error('Error deleting event after retries:', err);
    toast.error("Erro ao excluir evento. Verifique sua conexão e tente novamente.");
    return false;
  }
}
