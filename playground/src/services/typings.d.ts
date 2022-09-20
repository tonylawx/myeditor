// @ts-ignore
/* eslint-disable */

declare namespace API {
  type CurrentUser = {
    name?: string
    avatar?: string
    userid?: string
    email?: string
    signature?: string
    title?: string
    group?: string
    tags?: { key?: string; label?: string }[]
    notifyCount?: number
    unreadCount?: number
    country?: string
    access?: string
    geographic?: {
      province?: { label?: string; key?: string }
      city?: { label?: string; key?: string }
    }
    address?: string
    phone?: string
  }

  /** 全局通过表格查询返回结果 */
  type ResponseResult<T = any> = {
    data: T
    code: number
    msg: string
  }

  type TableListResult<T> = {
    pageNo: number
    pageSize: number
    rainbow: number[]
    rows: T[]
    totalPage: number
    totalRows: number
  }

  type PageResulet = {
    zoneId: string
    data: any
    code: any
  }

  /** 全局通用表格分页返回数据结构 */
  type PaginationResult = {
    page: number
    size: number
    total: number
  }

  /** 全局通用表格分页请求参数 */
  type PageParams<T = any> = {
    limit?: number
    page?: number
  } & {
    [P in keyof T]?: T[P]
  }

  type RuleListItem = {
    key?: number
    disabled?: boolean
    href?: string
    avatar?: string
    name?: string
    owner?: string
    desc?: string
    callNo?: number
    status?: number
    updatedAt?: string
    createdAt?: string
    progress?: number
  }

  type RuleList = {
    data?: RuleListItem[]
    /** 列表的内容总数 */
    total?: number
    success?: boolean
  }

  type FakeCaptcha = {
    code?: number
    status?: string
  }

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string
    /** 业务上的错误信息 */
    errorMessage?: string
    /** 业务上的请求是否成功 */
    success?: boolean
  }

  type NoticeIconList = {
    data?: NoticeIconItem[]
    /** 列表的内容总数 */
    total?: number
    success?: boolean
  }

  type NoticeIconItemType = 'notification' | 'message' | 'event'

  type NoticeIconItem = {
    id?: string
    extra?: string
    key?: string
    read?: boolean
    avatar?: string
    title?: string
    status?: string
    datetime?: string
    description?: string
    type?: NoticeIconItemType
  }
}

declare namespace SysAPI {
  interface RouterItem {
    alwaysShow: boolean
    children: RouterItem[]
    component: string
    hidden: boolean
    meta: { title: string; icon: string; noCache: boolean }
    name: string
    path: string
    redirect: string
  }
}
