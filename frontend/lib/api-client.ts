/**
 * API Client Wrapper
 * Handles all REST API calls to the backend with automatic token injection
 */

const API_BASE_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
    : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'

export interface ApiError {
  message: string
  statusCode: number
  errors?: Record<string, string>
}

export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}

/**
 * Get the auth token from localStorage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

/**
 * Perform a fetch request with automatic auth header injection
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getAuthToken()

  console.log('[API] Making request to:', url, 'Method:', options.method || 'GET')

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    console.log('[API] Response status:', response.status, 'for', url)

    const contentType = response.headers.get('content-type')
    let data

    if (contentType?.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      console.error('[API] Error response:', data)
      return {
        success: false,
        error: {
          message: data.message || `Error: ${response.statusText}`,
          statusCode: response.status,
          errors: data.errors,
        },
      }
    }

    console.log('[API] Success response for', url)
    return {
      success: true,
      data: data.data || data,
    }
  } catch (error) {
    console.error('[API Error]', endpoint, error)
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error('[API] Full error details:', {
      endpoint,
      url,
      error: errorMessage,
      errorType: error instanceof TypeError ? 'Network/CORS Error' : 'Unknown Error'
    })
    return {
      success: false,
      error: {
        message: errorMessage,
        statusCode: 0,
      },
    }
  }
}

/**
 * GET request
 */
export function apiGet<T>(endpoint: string, options?: RequestInit) {
  return fetchApi<T>(endpoint, {
    method: 'GET',
    ...options,
  })
}

/**
 * POST request
 */
export function apiPost<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
) {
  return fetchApi<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

/**
 * PATCH request
 */
export function apiPatch<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
) {
  return fetchApi<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

/**
 * PUT request
 */
export function apiPut<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
) {
  return fetchApi<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

/**
 * DELETE request
 */
export function apiDelete<T>(endpoint: string, options?: RequestInit) {
  return fetchApi<T>(endpoint, {
    method: 'DELETE',
    ...options,
  })
}

/**
 * Clear auth token (for logout)
 */
export function clearAuthToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

/**
 * Set auth token (for login)
 */
export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}
