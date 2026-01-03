import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const exportProjectSource = async () => {
    const zip = new JSZip();

    // Fetch public files
    const publicFiles = ['/index.html', '/favicon.ico', '/robots.txt']; 
    for (const file of publicFiles) {
        try {
            const response = await fetch(file);
            if(response.ok) {
                const content = await response.blob();
                zip.file(file.substring(1), content);
            } else {
                console.warn(`Could not fetch public file: ${file}`);
            }
        } catch(e) {
            console.error(`Error fetching ${file}:`, e);
        }
    }
    
    // Add src files (assuming a simple structure for now)
    // In a real app, this might need a file manifest or dynamic import.meta.glob
    const srcFiles = [
        '/src/App.css',
        '/src/App.tsx',
        '/src/index.css',
        '/src/index.tsx',
        '/src/vite-env.d.ts',
        '/src/components/AIAdvisor.tsx',
        '/src/components/ConfirmationModal.tsx',
        '/src/components/Dashboard.tsx',
        '/src/components/DataMigrationModal.tsx',
        '/src/components/ExcelImport.tsx',
        '/src/components/InventoryList.tsx',
        '/src/components/Login.tsx',
        '/src/components/ManualModal.tsx',
        '/src/components/MasterDataManagerModal.tsx',
        '/src/components/MonthlyReportModal.tsx',
        '/src/components/ReportModal.tsx',
        '/src/components/StockForm.tsx',
        '/src/components/TransactionHistoryImport.tsx',
        '/src/components/TransactionModal.tsx',
        '/src/components/UserManagerModal.tsx',
        '/src/constants.ts',
        '/src/types.ts',
        '/src/utils/logger.ts',
        '/src/utils/sourceExporter.ts',
        // Add paths to other files in src
    ];

    for (const file of srcFiles) {
       try {
            const response = await fetch(file);
            if(response.ok) {
                const content = await response.text();
                zip.file(file.substring(1), content);
            } else {
                 console.warn(`Could not fetch src file: ${file}`);
            }
        } catch(e) {
            console.error(`Error fetching ${file}:`, e);
        }
    }

    // Add root config files
    const rootFiles = [
        '/package.json',
        '/package-lock.json',
        '/tsconfig.json',
        '/tsconfig.node.json',
        '/vite.config.ts',
        '/tailwind.config.js',
        '/postcss.config.js',
        '/.eslintrc.cjs',
    ];
    for (const file of rootFiles) {
        try {
            const response = await fetch(file);
            if(response.ok) {
                const content = await response.text();
                zip.file(file.substring(1), content);
            } else {
                console.warn(`Could not fetch root file: ${file}`);
            }
        } catch(e) {
            console.error(`Error fetching ${file}:`, e);
        }
    }

    // Generate and download the zip
    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `cheonan-water-inventory-app-source.zip`);
    });
};
