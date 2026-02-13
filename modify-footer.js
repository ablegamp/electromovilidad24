#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const articulosDir = path.join(__dirname, 'articulos');
const oldText = 'con más de 50.000 km de experiencia';
const newText = 'con más de 15.000 km de experiencia';

// Function to modify footer in a single file
function modifyFooter(filePath) {
  try {
    // Read file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the text to replace exists
    if (!content.includes(oldText)) {
      console.log(`⚠️  Text not found in ${path.basename(filePath)}`);
      return false;
    }
    
    // Replace the text
    content = content.replace(oldText, newText);
    
    // Write back to file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`✅ Modified: ${path.basename(filePath)}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

// Main function to process all HTML files
function processAllArticles() {
  console.log('🔧 Starting footer modification process...\n');
  
  try {
    // Get all HTML files in articulos directory
    const files = fs.readdirSync(articulosDir);
    const htmlFiles = files.filter(file => file.endsWith('.html'));
    
    console.log(`📁 Found ${htmlFiles.length} HTML files in articulos directory\n`);
    
    let modifiedCount = 0;
    let skippedCount = 0;
    
    // Process each file
    htmlFiles.forEach(file => {
      const filePath = path.join(articulosDir, file);
      const wasModified = modifyFooter(filePath);
      
      if (wasModified) {
        modifiedCount++;
      } else {
        skippedCount++;
      }
    });
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`✅ Successfully modified: ${modifiedCount} files`);
    console.log(`⚠️  Skipped (text not found): ${skippedCount} files`);
    console.log(`📈 Total processed: ${htmlFiles.length} files`);
    
    if (modifiedCount > 0) {
      console.log('\n🎉 Footer modification completed successfully!');
    } else {
      console.log('\n⚠️  No files were modified. Check if the text exists in the articles.');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  processAllArticles();
}

module.exports = { modifyFooter, processAllArticles };
