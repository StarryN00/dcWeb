'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { exportLeadsToCSV, generateFilename } from '@/utils/export-csv';

interface Lead {
  id: string;
  name: string;
  phone: string;
  propertyType: string;
  area: number;
  budget: number;
  styles: string[];
  stage: string;
  timeline: string;
  score: number;
  status: string;
  submittedAt: string;
  updatedAt: string;
}

export default function AdminLeadsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // 认证检查
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  // 获取潜客列表
  useEffect(() => {
    if (status === 'authenticated') {
      fetchLeads();
    }
  }, [status]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setLeads(data.data);
      } else {
        setError('获取潜客列表失败:数据格式错误');
        setLeads([]);
      }
    } catch (error) {
      console.error('获取潜客失败:', error);
      setError('获取潜客列表失败');
      setLeads([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 更新状态
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchLeads(); // 刷新列表
        setSelectedLead(null);
      } else {
        alert('更新状态失败');
      }
    } catch (error) {
      console.error('更新状态失败:', error);
      alert('更新状态失败');
    }
  };

  // 导出CSV
  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('暂无数据可导出');
      return;
    }

    const filename = generateFilename('潜客数据');
    exportLeadsToCSV(leads, filename);
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-stone-600 bg-stone-100';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    return 'D';
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: '待跟进', color: 'bg-yellow-100 text-yellow-700' },
    contacted: { label: '已联系', color: 'bg-blue-100 text-blue-700' },
    scheduled: { label: '已预约', color: 'bg-purple-100 text-purple-700' },
    closed: { label: '已成交', color: 'bg-green-100 text-green-700' },
    abandoned: { label: '已放弃', color: 'bg-stone-100 text-stone-700' },
  };

  const propertyTypeMap: Record<string, string> = {
    residential: '住宅',
    apartment: '公寓',
    villa: '别墅',
    commercial: '商业空间',
    other: '其他',
  };

  const stageMap: Record<string, string> = {
    design_only: '仅设计',
    design_construction: '设计+施工',
    construction_only: '仅施工',
    supervision_only: '仅监理',
  };

  const timelineMap: Record<string, string> = {
    within_1_month: '1个月内',
    within_1_3_months: '1-3个月',
    within_3_6_months: '3-6个月',
    over_6_months: '6个月以上',
    no_plan: '暂无计划',
  };

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
          <h1 className="text-3xl font-bold text-stone-900">潜客管理</h1>
          <p className="text-stone-600 mt-1">查看和管理潜在客户信息</p>
        </div>
        {leads.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            导出CSV
          </button>
        )}
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* 潜客表格 */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  评分
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  姓名
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  电话
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  物业类型
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  面积/预算
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  时间规划
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">
                  提交时间
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-stone-700">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-stone-500">暂无潜客数据</p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold ${getScoreColor(
                          lead.score
                        )}`}
                      >
                        <span className="text-lg">{lead.score}</span>
                        <span className="text-xs">({getScoreLevel(lead.score)}级)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-stone-900">{lead.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${lead.phone}`}
                        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        <PhoneIcon className="w-4 h-4" />
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-stone-700">
                      {propertyTypeMap[lead.propertyType] || lead.propertyType}
                    </td>
                    <td className="px-6 py-4 text-stone-700">
                      {lead.area}㎡ / {lead.budget}万
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-stone-600">
                        {timelineMap[lead.timeline] || lead.timeline}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          statusMap[lead.status]?.color || 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {statusMap[lead.status]?.label || lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-600">
                      {new Date(lead.submittedAt).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="px-4 py-2 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors font-medium"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 统计信息 */}
      {leads.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-stone-900 mb-4">统计信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-stone-600">总潜客数</p>
              <p className="text-2xl font-bold text-stone-900">{leads.length}</p>
            </div>
            <div>
              <p className="text-sm text-stone-600">A级潜客</p>
              <p className="text-2xl font-bold text-emerald-600">
                {leads.filter((l) => l.score >= 90).length}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600">待跟进</p>
              <p className="text-2xl font-bold text-yellow-600">
                {leads.filter((l) => l.status === 'pending').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600">已预约</p>
              <p className="text-2xl font-bold text-purple-600">
                {leads.filter((l) => l.status === 'scheduled').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-stone-600">已成交</p>
              <p className="text-2xl font-bold text-green-600">
                {leads.filter((l) => l.status === 'closed').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 潜客详情模态框 */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white p-6 rounded-t-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{selectedLead.name}</h2>
                  <p className="text-emerald-100">潜客详细信息</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-bold text-lg ${getScoreColor(
                    selectedLead.score
                  )}`}
                >
                  {selectedLead.score}分 ({getScoreLevel(selectedLead.score)}级)
                </div>
              </div>
            </div>

            {/* 内容 */}
            <div className="p-6 space-y-6">
              {/* 联系信息 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">联系信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-stone-600">手机号</p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm text-stone-600">提交时间</p>
                      <p className="font-semibold text-stone-900">
                        {new Date(selectedLead.submittedAt).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 需求信息 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">需求信息</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-stone-600 mb-1">物业类型</p>
                    <p className="font-semibold text-stone-900">
                      {propertyTypeMap[selectedLead.propertyType]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600 mb-1">房屋面积</p>
                    <p className="font-semibold text-stone-900">{selectedLead.area}㎡</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600 mb-1">装修预算</p>
                    <p className="font-semibold text-stone-900">{selectedLead.budget}万元</p>
                  </div>
                  <div>
                    <p className="text-sm text-stone-600 mb-1">服务需求</p>
                    <p className="font-semibold text-stone-900">
                      {stageMap[selectedLead.stage]}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-stone-600 mb-1">时间规划</p>
                    <p className="font-semibold text-stone-900">
                      {timelineMap[selectedLead.timeline]}
                    </p>
                  </div>
                </div>
              </div>

              {/* 风格偏好 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">风格偏好</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.styles.map((style) => (
                    <span
                      key={style}
                      className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                    >
                      {styleMap[style] || style}
                    </span>
                  ))}
                </div>
              </div>

              {/* 状态更新 */}
              <div>
                <h3 className="text-lg font-bold text-stone-900 mb-3">更新状态</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(statusMap).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => updateStatus(selectedLead.id, key)}
                      className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                        selectedLead.status === key
                          ? value.color + ' shadow-md'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {value.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="sticky bottom-0 bg-stone-50 p-6 rounded-b-2xl border-t border-stone-200">
              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-3 bg-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-300 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
