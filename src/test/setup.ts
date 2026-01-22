import '@testing-library/jest-dom'

// 全局测试设置
// 这里可以添加全局的测试配置、mocks或扩展

// 例如，可以添加自定义的匹配器
// expect.extend({
//   toBeWithinRange(received: number, floor: number, ceiling: number) {
//     const pass = received >= floor && received <= ceiling;
//     if (pass) {
//       return {
//         message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
//         pass: true,
//       };
//     } else {
//       return {
//         message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
//         pass: false,
//       };
//     }
//   },
// });

// 设置console.error捕获，防止测试过程中出现不必要的错误输出
const originalError = console.error
console.error = (...args) => {
  // 忽略React的一些警告，例如关于act()的警告
  if (/Warning:.*not wrapped in act/.test(args[0])) {
    return
  }
  originalError(...args)
}
