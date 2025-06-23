/**
 * Script para implementar a padronização da interface do cliente
 * 
 * Este script facilita a implementação da padronização da interface do cliente
 * substituindo os componentes originais pelos componentes padronizados.
 * 
 * Uso:
 * 1. Execute este script a partir da raiz do projeto:
 *    node scripts/implementar-padronizacao.js
 * 
 * 2. Siga as instruções no console para implementar cada fase da padronização.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Obter o caminho do diretório atual em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components', 'clients');

// Mapeamento de componentes originais para componentes padronizados
const COMPONENT_MAPPING = [
  { original: 'ClientInfoTabs.tsx', standardized: 'ClientInfoTabsStandardized.tsx', phase: 'Fase 1: Tela de Chat' },
  { original: 'ClientDetailSheet.tsx', standardized: 'ClientDetailSheetStandardized.tsx', phase: 'Fase 2: Tela de Detalhes' },
  { original: 'ClientsTable.tsx', standardized: 'ClientsTableStandardized.tsx', phase: 'Fase 3: Tabela de Clientes' },
  { original: 'EditClientDialog.tsx', standardized: 'EditClientFormStandardized.tsx', phase: 'Fase 4: Formulário de Edição' },
  { original: 'NewClientDialog.tsx', standardized: 'NewClientFormStandardized.tsx', phase: 'Fase 4: Formulário de Criação' }
];

// Função para verificar se um arquivo existe
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    console.error(`Erro ao verificar se o arquivo existe: ${filePath}`, err);
    return false;
  }
}

// Função para fazer backup de um arquivo
function backupFile(filePath) {
  try {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`Backup criado: ${backupPath}`);
    return true;
  } catch (err) {
    console.error(`Erro ao criar backup do arquivo: ${filePath}`, err);
    return false;
  }
}

// Função para substituir um arquivo
function replaceFile(originalPath, standardizedPath) {
  try {
    const originalContent = fs.readFileSync(standardizedPath, 'utf8');
    fs.writeFileSync(originalPath, originalContent);
    console.log(`Arquivo substituído com sucesso: ${originalPath}`);
    return true;
  } catch (err) {
    console.error(`Erro ao substituir o arquivo: ${originalPath}`, err);
    return false;
  }
}

// Função para implementar uma fase específica
function implementPhase(phase) {
  console.log(`\nImplementando ${phase}...`);
  
  const components = COMPONENT_MAPPING.filter(comp => comp.phase === phase);
  
  if (components.length === 0) {
    console.log(`Nenhum componente encontrado para ${phase}`);
    return;
  }
  
  components.forEach(component => {
    const originalPath = path.join(COMPONENTS_DIR, component.original);
    const standardizedPath = path.join(COMPONENTS_DIR, component.standardized);
    
    if (!fileExists(originalPath)) {
      console.log(`Arquivo original não encontrado: ${component.original}`);
      return;
    }
    
    if (!fileExists(standardizedPath)) {
      console.log(`Arquivo padronizado não encontrado: ${component.standardized}`);
      return;
    }
    
    console.log(`Substituindo ${component.original} por ${component.standardized}...`);
    
    if (backupFile(originalPath)) {
      if (replaceFile(originalPath, standardizedPath)) {
        console.log(`✅ ${component.original} substituído com sucesso!`);
      } else {
        console.log(`❌ Falha ao substituir ${component.original}`);
      }
    } else {
      console.log(`❌ Falha ao criar backup de ${component.original}`);
    }
  });
}

// Função principal
function main() {
  console.log('=== Implementação da Padronização da Interface do Cliente ===');
  console.log('\nEste script irá ajudá-lo a implementar a padronização da interface do cliente.');
  console.log('Cada fase substituirá os componentes originais pelos componentes padronizados.');
  console.log('Backups dos arquivos originais serão criados antes da substituição.');
  
  console.log('\nFases disponíveis:');
  const phases = [...new Set(COMPONENT_MAPPING.map(comp => comp.phase))];
  phases.forEach((phase, index) => {
    console.log(`${index + 1}. ${phase}`);
  });
  
  rl.question('\nDigite o número da fase que deseja implementar (ou "todas" para implementar todas as fases): ', (answer) => {
    if (answer.toLowerCase() === 'todas') {
      phases.forEach(phase => implementPhase(phase));
      console.log('\n✅ Todas as fases foram implementadas!');
    } else {
      const phaseIndex = parseInt(answer) - 1;
      if (phaseIndex >= 0 && phaseIndex < phases.length) {
        implementPhase(phases[phaseIndex]);
        console.log(`\n✅ Fase ${phaseIndex + 1} implementada!`);
      } else {
        console.log('\n❌ Opção inválida!');
      }
    }
    
    console.log('\nLembre-se de verificar se a implementação foi bem-sucedida testando cada componente.');
    console.log('Caso encontre problemas, você pode restaurar os backups renomeando os arquivos .bak.');
    
    rl.close();
  });
}

// Executar o script
main();