const fs = require('fs');
const path = require('path');
const readline = require('readline');

const planPath = path.join(__dirname, '..', '..', '开发计划.md');

// 读取开发计划文件
const readPlan = () => {
  return fs.readFileSync(planPath, 'utf8');
};

// 写入更新后的开发计划
const writePlan = (content) => {
  fs.writeFileSync(planPath, content, 'utf8');
};

// 解析当前阶段
const getCurrentPhase = (content) => {
  const phaseRegex = /## 阶段(\d+)：.*?（进行中）/;
  const match = content.match(phaseRegex);
  return match ? parseInt(match[1]) : null;
};

// 更新任务状态
const updateTaskStatus = (content, phase, taskIndex, completed = true) => {
  const phaseRegex = new RegExp(`## 阶段${phase}：.*?\\n([\\s\\S]*?)(?=\\n---\\n|$)`);
  const phaseMatch = content.match(phaseRegex);
  
  if (!phaseMatch) return content;
  
  const phaseContent = phaseMatch[1];
  const taskLines = phaseContent.split('\n');
  
  // 查找并更新指定任务
  for (let i = 0; i < taskLines.length; i++) {
    if (taskLines[i].includes(`- [ ]`) && i === taskIndex - 1) {
      taskLines[i] = taskLines[i].replace('- [ ]', '- [x]');
      break;
    }
  }
  
  // 重建阶段内容
  const updatedPhaseContent = taskLines.join('\n');
  return content.replace(phaseMatch[1], updatedPhaseContent);
};

// 移动到下一阶段
const moveToNextPhase = (content) => {
  const currentPhase = getCurrentPhase(content);
  if (!currentPhase) return content;
  
  // 将当前阶段标记为已完成
  content = content.replace(`## 阶段${currentPhase}：.*?（进行中）`, `## 阶段${currentPhase}：.*?（已完成）`);
  
  // 将下一阶段标记为进行中
  content = content.replace(`## 阶段${currentPhase + 1}：.*?`, `## 阶段${currentPhase + 1}：.*?（进行中）`);
  
  return content;
};

// 交互式命令行
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('开发计划更新工具');
console.log('----------------');
console.log('1. 更新任务状态');
console.log('2. 移动到下一阶段');
console.log('3. 退出');

rl.question('请选择操作: ', (answer) => {
  const planContent = readPlan();
  
  switch (answer) {
    case '1':
      const currentPhase = getCurrentPhase(planContent);
      rl.question(`当前阶段: ${currentPhase}，请输入要更新的任务索引: `, (taskIndex) => {
        const updatedContent = updateTaskStatus(planContent, currentPhase, parseInt(taskIndex));
        writePlan(updatedContent);
        console.log('任务状态已更新！');
        rl.close();
      });
      break;
    case '2':
      const updatedContent = moveToNextPhase(planContent);
      writePlan(updatedContent);
      console.log('已移动到下一阶段！');
      rl.close();
      break;
    case '3':
    default:
      rl.close();
      break;
  }
});