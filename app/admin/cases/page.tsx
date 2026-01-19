'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import { CaseModal } from '@/components/admin';

interface Case {
  id: string;
  title: string;
  location: string;
  style: string;
  area: number;
  duration: number;
  price: number;
  images: string[];
  description: string;
  testimonial: string;
  foremanName: string;
  foremanPhone: string;
  stage: string;
  featured: boolean;
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export default function AdminCasesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCase, setSelectedCase] = useState<Case | undefined>(undefined);

  // 认证检查
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // 获取案例列表
  useEffect(() => {
    if (status === 'authenticated') {
      fetchCases();
    }
  }, [status]);

  const fetchCases = async () => {
    try {
      const response = await fetch('/api/cases?includeAll=true');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setCases(data.data);
      } else {
        setError('获取案例列表失败:数据格式错误');
        setCases([]);
      }
    } catch (error) {
      console.error('获取案例失败:', error);
      setError('获取案例列表失败');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换发布状态
  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';

      const response = await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCases(); // 刷新列表
      } else {
        alert('更新状态失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新状态失败');
    }
  };

  // 切换推荐状态
  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

      if (response.ok) {
        fetchCases(); // 刷新列表
      } else {
        alert('更新推荐状态失败');
      }
    } catch (error) {
      console.error('更新推荐状态失败:', error);
      alert('更新推荐状态失败');
    }
  };

  // 删除案例
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`确定要删除案例 "${title}" 吗?此操作不可恢复!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCases(); // 刷新列表
      } else {
        alert('删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  };

  // 打开创建模态框
  const handleCreate = () => {
    setModalMode('create');
    setSelectedCase(undefined);
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const handleEdit = (caseItem: Case) => {
    setModalMode('edit');
    setSelectedCase(caseItem);
    setIsModalOpen(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCase(undefined);
  };

  // 模态框提交成功
  const handleModalSuccess = () => {
    fetchCases(); // 刷新列表
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const styleMap: Record<string, string> = {
    modern: '现代',
    nordic: '北欧',
    industrial: '工业',
    wabisabi: '侘寂',
    luxury: '轻奢',
    minimalist: '极简',
    chinese: '中式',
    european: '欧式',
  };

  return (
    <div className="space-y-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">案例管理</h1>
          <p className="text-stone-600 mt-1">管理装修案例的展示和发布</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
          创建案例
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 案例表格 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  标题
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  位置
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  风格
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  面积
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  价格
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  推荐
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-stone-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-stone-500">暂无案例数据</p>
                    <button
                      onClick={handleCreate}
                      className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      创建第一个案例
                    </button>
                  </td>
                </tr>
              ) : (
                cases.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs text-stone-500 font-mono">
                        {item.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.images[0] && (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-semibold text-stone-900">
                          {item.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{item.location}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {styleMap[item.style] || item.style}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-stone-700">{item.area}㎡</td>
                    <td className="px-6 py-4 text-stone-700">{item.price}万</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(item.id, item.status)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {item.status === 'published' ? (
                          <>
                            <EyeIcon className="w-4 h-4" />
                            已发布
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="w-4 h-4" />
                            草稿
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(item.id, item.featured)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          item.featured ? 'opacity-100' : 'opacity-30'
                        }`}
                        title={item.featured ? '取消推荐' : '设为推荐'}
                      >
                        ⭐
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="编辑"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="删除"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      {cases.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-stone-900 mb-4">统计信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-stone-600">总案例数</p>
              <p className="text-2xl font-bold text-stone-900">{cases.length}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600">已发布</p>
              <p className="text-2xl font-bold text-green-600">
                {cases.filter((c) => c.status === 'published').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600">草稿</p>
              <p className="text-2xl font-bold text-stone-600">
                {cases.filter((c) => c.status === 'draft').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600">推荐案例</p>
              <p className="text-2xl font-bold text-amber-600">
                {cases.filter((c) => c.featured).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 案例创建/编辑模态框 */}
      <CaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleModalSuccess}
        caseData={selectedCase}
        mode={modalMode}
      />
    </div>
  );
}
