'use client';

import { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Input,
  Textarea,
  Modal,
  ModalContent,
  ModalFooter,
  Badge,
  ScoreBadge,
  StatusBadge,
  Select,
  Loading,
  Skeleton,
  CardSkeleton,
} from '@/components/ui';

export default function ComponentsShowcasePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-stone-900 mb-8">
          UI 组件库展示
        </h1>

        {/* Button 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Button 按钮</h2>
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-600 mb-2">变体 (Variants)</p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-2">尺寸 (Sizes)</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-2">状态 (States)</p>
                  <div className="flex flex-wrap gap-3">
                    <Button loading>Loading</Button>
                    <Button disabled>Disabled</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Card 卡片</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card variant="standard" hoverable>
              <CardHeader>
                <CardTitle>标准卡片</CardTitle>
              </CardHeader>
              <CardContent>
                这是一个标准卡片,带有悬停效果。鼠标悬停时会有阴影和位移动画。
              </CardContent>
              <CardFooter>
                <Button size="sm">操作按钮</Button>
              </CardFooter>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle>毛玻璃卡片</CardTitle>
              </CardHeader>
              <CardContent>
                这是一个毛玻璃效果的卡片,具有半透明背景和模糊效果。
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Input 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Input 输入框</h2>
          <Card>
            <CardContent>
              <div className="space-y-6">
                <Input
                  label="姓名"
                  placeholder="请输入姓名"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Input
                  label="手机号"
                  type="tel"
                  placeholder="请输入手机号"
                  error="请输入有效的11位手机号"
                  required
                />
                <Input
                  label="邮箱"
                  type="email"
                  placeholder="example@email.com"
                  helperText="我们会向此邮箱发送确认信息"
                />
                <Textarea
                  label="项目描述"
                  placeholder="请描述您的装修需求..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Badge 徽章</h2>
          <Card>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-600 mb-2">基础徽章</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-2">评分徽章</p>
                  <div className="flex flex-wrap gap-2">
                    <ScoreBadge score={95} />
                    <ScoreBadge score={82} />
                    <ScoreBadge score={65} />
                    <ScoreBadge score={55} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-stone-600 mb-2">状态徽章</p>
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="published" />
                    <StatusBadge status="draft" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="contacted" />
                    <StatusBadge status="closed" />
                    <StatusBadge status="abandoned" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Select 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Select 选择框</h2>
          <Card>
            <CardContent>
              <Select
                label="装修风格"
                value={selectValue}
                onChange={setSelectValue}
                placeholder="请选择装修风格"
                options={[
                  { value: 'modern', label: '现代' },
                  { value: 'nordic', label: '北欧' },
                  { value: 'industrial', label: '工业' },
                  { value: 'minimalist', label: '极简' },
                ]}
              />
              {selectValue && (
                <p className="mt-4 text-sm text-stone-600">
                  已选择: {selectValue}
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Modal 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Modal 模态框</h2>
          <Card>
            <CardContent>
              <Button onClick={() => setIsModalOpen(true)}>打开模态框</Button>
            </CardContent>
          </Card>

          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="示例模态框"
          >
            <ModalContent>
              <p className="text-stone-600">
                这是一个模态框示例。你可以在这里放置任何内容,比如表单、确认对话框等。
              </p>
            </ModalContent>
            <ModalFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>确认</Button>
            </ModalFooter>
          </Modal>
        </section>

        {/* Loading 组件 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Loading 加载</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>加载指示器</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-stone-600 mb-2">不同尺寸</p>
                    <div className="flex items-center gap-6">
                      <Loading size="sm" />
                      <Loading size="md" />
                      <Loading size="lg" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600 mb-2">带文本</p>
                    <Loading size="md" text="加载中..." />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>骨架屏</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" count={3} />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <CardSkeleton />
          </div>
        </section>

        {/* 组合示例 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">组合示例</h2>
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>案例卡片示例</CardTitle>
                <StatusBadge status="published" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Badge variant="info">现代</Badge>
                  <span className="text-stone-600">120㎡ · 60天 · 25万</span>
                </div>
                <p className="text-stone-600">
                  这是一个现代风格的装修案例,采用简约设计理念,注重空间的功能性和美观性。
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-3 w-full">
                <Button variant="outline" className="flex-1">查看详情</Button>
                <Button className="flex-1">立即咨询</Button>
              </div>
            </CardFooter>
          </Card>
        </section>
      </div>
    </div>
  );
}
