
-- Enable RLS on all tables that don't have it yet
ALTER TABLE public.dados_cliente ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imagens_drive ENABLE ROW LEVEL SECURITY;

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin', false);
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin());

-- RLS Policies for dados_cliente (client data)
CREATE POLICY "Authenticated users can view client data" ON public.dados_cliente
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert client data" ON public.dados_cliente
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update client data" ON public.dados_cliente
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete client data" ON public.dados_cliente
  FOR DELETE USING (public.is_admin());

-- RLS Policies for conversations
CREATE POLICY "Authenticated users can view conversations" ON public.conversations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert conversations" ON public.conversations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update conversations" ON public.conversations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete conversations" ON public.conversations
  FOR DELETE USING (public.is_admin());

-- RLS Policies for contacts
CREATE POLICY "Authenticated users can view contacts" ON public.contacts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert contacts" ON public.contacts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contacts" ON public.contacts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete contacts" ON public.contacts
  FOR DELETE USING (public.is_admin());

-- RLS Policies for chat_messages
CREATE POLICY "Authenticated users can view chat messages" ON public.chat_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chat messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chat messages" ON public.chat_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete chat messages" ON public.chat_messages
  FOR DELETE USING (public.is_admin());

-- RLS Policies for chats
CREATE POLICY "Authenticated users can view chats" ON public.chats
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chats" ON public.chats
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chats" ON public.chats
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete chats" ON public.chats
  FOR DELETE USING (public.is_admin());

-- RLS Policies for n8n_chat_histories
CREATE POLICY "Authenticated users can view chat histories" ON public.n8n_chat_histories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert chat histories" ON public.n8n_chat_histories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update chat histories" ON public.n8n_chat_histories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete chat histories" ON public.n8n_chat_histories
  FOR DELETE USING (public.is_admin());

-- RLS Policies for n8n_chat_history
CREATE POLICY "Authenticated users can view legacy chat history" ON public.n8n_chat_history
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert legacy chat history" ON public.n8n_chat_history
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update legacy chat history" ON public.n8n_chat_history
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete legacy chat history" ON public.n8n_chat_history
  FOR DELETE USING (public.is_admin());

-- RLS Policies for documents
CREATE POLICY "Authenticated users can view documents" ON public.documents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert documents" ON public.documents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update documents" ON public.documents
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete documents" ON public.documents
  FOR DELETE USING (public.is_admin());

-- RLS Policies for tokens (admin only access)
CREATE POLICY "Admins can view tokens" ON public.tokens
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can insert tokens" ON public.tokens
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tokens" ON public.tokens
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete tokens" ON public.tokens
  FOR DELETE USING (public.is_admin());

-- RLS Policies for imagens_drive
CREATE POLICY "Authenticated users can view images" ON public.imagens_drive
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert images" ON public.imagens_drive
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update images" ON public.imagens_drive
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete images" ON public.imagens_drive
  FOR DELETE USING (public.is_admin());

-- Add updated_at trigger for profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing kanban_stage constraint if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'check_kanban_stage'
  ) THEN
    ALTER TABLE public.dados_cliente 
    ADD CONSTRAINT check_kanban_stage 
    CHECK (kanban_stage IN ('Entraram', 'Conversaram', 'Agendaram', 'Compareceram', 'Negociaram', 'Postergaram', 'Converteram'));
  END IF;
END $$;
