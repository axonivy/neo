/**
 * Generated by orval v7.0.1 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import { customFetch } from '../custom-fetch';
export type FindFeedbacksParams = {
  /**
   * Page number to retrieve
   */
  page: number;
  /**
   * Number of items per page
   */
  size?: number;
  /**
   * Sorting criteria in the format: Sorting criteria(popularity|alphabetically|recent), Sorting order(asc|desc)
   */
  sort: string[];
};

export type FindProductVersionsByIdParams = {
  /**
   * Option to get Dev Version (Snapshot/ sprint release)
   */
  isShowDevVersion: boolean;
  designerVersion?: string;
};

export type FindProductsLanguage = (typeof FindProductsLanguage)[keyof typeof FindProductsLanguage];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FindProductsLanguage = {
  en: 'en',
  de: 'de'
} as const;

export type FindProductsType = (typeof FindProductsType)[keyof typeof FindProductsType];

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const FindProductsType = {
  all: 'all',
  connectors: 'connectors',
  utilities: 'utilities',
  solutions: 'solutions',
  demos: 'demos'
} as const;

export type FindProductsParams = {
  /**
   * Page number to retrieve
   */
  page: number;
  /**
   * Number of items per page
   */
  size?: number;
  /**
   * Sorting criteria in the format: Sorting criteria(popularity|alphabetically|recent), Sorting order(asc|desc)
   */
  sort: string[];
  /**
   * Type of product.
   */
  type: FindProductsType;
  /**
   * Keyword that exist in product's name or short description
   */
  keyword?: string;
  /**
   * Language of product short description
   */
  language: FindProductsLanguage;
  /**
   * Option to render the website in the REST Client Editor of Designer
   */
  isRESTClient: boolean;
};

export type FindFeedbackByUserIdAndProductIdParams = {
  /**
   * Id of current user from DB
   */
  userId: string;
  /**
   * Product id (from meta.json)
   */
  productId: string;
};

export interface Link {
  deprecation?: string;
  href?: string;
  hreflang?: string;
  name?: string;
  profile?: string;
  templated?: boolean;
  title?: string;
  type?: string;
}

export interface ProductRating {
  /** Count of rating on this specific point */
  commentNumber?: number;
  /** Weight ration of this point/ total point */
  percent?: number;
  /** Specific rating point of product */
  starRating?: number;
}

export interface FeedbackModel {
  _links?: Links;
  /** User's feedback content */
  content?: string;
  /** Feedback/rating creating timestamp */
  createdAt?: string;
  /** Id of feedback */
  id?: string;
  /** Product id (from meta.json) */
  productId?: string;
  /**
   * User's rating point of target product
   * @minimum 1
   * @maximum 5
   */
  rating?: number;
  /** Latest feedback/rating updating timestamp */
  updatedAt?: string;
  /** Url of github avatar */
  userAvatarUrl?: string;
  /** User Id */
  userId?: string;
  /** Github username */
  username?: string;
  /** 3rd party login provider */
  userProvider?: string;
}

export type _PagedModelFeedbackModelEmbedded = {
  feedbacks?: FeedbackModel[];
};

export interface PagedModelFeedbackModel {
  _embedded?: _PagedModelFeedbackModelEmbedded;
  _links?: Links;
  page?: PageMetadata;
}

export interface MavenArtifactModel {
  /** Artifact download url */
  downloadUrl?: string;
  isProductArtifact?: boolean;
  /** Display name and type of artifact */
  name?: string;
}

export interface MavenArtifactVersionModel {
  artifactsByVersion?: MavenArtifactModel[];
  /** Target version */
  version?: string;
}

/**
 * Setup tab content
 */
export type ProductModuleContentSetup = { [key: string]: string };

/**
 * Product detail description content
 */
export type ProductModuleContentDescription = { [key: string]: string };

/**
 * Demo tab content
 */
export type ProductModuleContentDemo = { [key: string]: string };

export interface ProductModuleContent {
  /** Product artifact's artifact id */
  artifactId?: string;
  /** Demo tab content */
  demo?: ProductModuleContentDemo;
  /** Product detail description content  */
  description?: ProductModuleContentDescription;
  /** Product artifact's group id */
  groupId?: string;
  /** Is dependency artifact */
  isDependency?: boolean;
  name?: string;
  /** Setup tab content */
  setup?: ProductModuleContentSetup;
  /** Target release tag */
  tag?: string;
  /** Artifact file type */
  type?: string;
}

/**
 * Product's short descriptions by locale
 */
export type ProductDetailModelShortDescriptions = { [key: string]: string };

/**
 * Product name by locale
 */
export type ProductDetailModelNames = { [key: string]: string };

export interface ProductDetailModel {
  _links?: Links;
  /** Compatibility */
  compatibility?: string;
  /** Can contact us */
  contactUs?: boolean;
  /** Product cost */
  cost?: string;
  /** Product id */
  id?: string;
  /** Product industry */
  industry?: string;
  /** Installation/download count */
  installationCount?: number;
  /** Default language */
  language?: string;
  /** Product's logo url */
  logoUrl?: string;
  /** Product name by locale */
  names?: ProductDetailModelNames;
  /** Latest release version from maven */
  newestReleaseVersion?: string;
  /** Platform review */
  platformReview?: string;
  productModuleContent?: ProductModuleContent;
  /** Product's short descriptions by locale */
  shortDescriptions?: ProductDetailModelShortDescriptions;
  /** Source repository url */
  sourceUrl?: string;
  /** Status badge url */
  statusBadgeUrl?: string;
  /** Tags of product */
  tags?: string[];
  /** Type of product */
  type?: string;
  /** Product vendor */
  vendor?: string;
}

/**
 * Product's short descriptions by locale
 */
export type ProductModelShortDescriptions = { [key: string]: string };

/**
 * Product name by locale
 */
export type ProductModelNames = { [key: string]: string };

export interface ProductModel {
  _links?: Links;
  /** Product id */
  id?: string;
  /** Product's logo url */
  logoUrl?: string;
  /** Product name by locale */
  names?: ProductModelNames;
  /** Product's short descriptions by locale */
  shortDescriptions?: ProductModelShortDescriptions;
  /** Tags of product */
  tags?: string[];
  /** Type of product */
  type?: string;
}

export type _PagedModelProductModelEmbedded = {
  products?: ProductModel[];
};

export interface PageMetadata {
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export interface Links {
  [key: string]: Link;
}

export interface PagedModelProductModel {
  _embedded?: _PagedModelProductModelEmbedded;
  _links?: Links;
  page?: PageMetadata;
}

export interface FeedbackModelRequest {
  /**
   * User's feedback content
   * @minLength 0
   * @maxLength 250
   */
  content: string;
  /** Product id (from meta.json) */
  productId: string;
  /**
   * User's rating point of target product
   * @minimum 1
   * @maximum 5
   */
  rating?: number;
}

/**
 * By default, increase installation count when click download product files by users
 * @summary Update installation count of product
 */
export type syncInstallationCountResponse = {
  data: number;
  status: number;
};

export const getSyncInstallationCountUrl = (id: string) => {
  return `/api/product-details/installationcount/${id}`;
};

export const syncInstallationCount = async (id: string, options?: RequestInit): Promise<syncInstallationCountResponse> => {
  return customFetch<Promise<syncInstallationCountResponse>>(getSyncInstallationCountUrl(id), {
    ...options,
    method: 'PUT'
  });
};

/**
 * Get current user feedback on target product.
 * @summary Find all feedbacks by user id and product id
 */
export type findFeedbackByUserIdAndProductIdResponse = {
  data: FeedbackModel;
  status: number;
};

export const getFindFeedbackByUserIdAndProductIdUrl = (params: FindFeedbackByUserIdAndProductIdParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/api/feedback?${normalizedParams.toString()}` : `/api/feedback`;
};

export const findFeedbackByUserIdAndProductId = async (
  params: FindFeedbackByUserIdAndProductIdParams,
  options?: RequestInit
): Promise<findFeedbackByUserIdAndProductIdResponse> => {
  return customFetch<Promise<findFeedbackByUserIdAndProductIdResponse>>(getFindFeedbackByUserIdAndProductIdUrl(params), {
    ...options,
    method: 'GET'
  });
};

/**
 * Save user feedback of product with their token from Github account.
 * @summary Create user feedback
 */
export type createFeedbackResponse = {
  data: void;
  status: number;
};

export const getCreateFeedbackUrl = () => {
  return `/api/feedback`;
};

export const createFeedback = async (
  feedbackModelRequest: FeedbackModelRequest,
  options?: RequestInit
): Promise<createFeedbackResponse> => {
  return customFetch<Promise<createFeedbackResponse>>(getCreateFeedbackUrl(), {
    ...options,
    method: 'POST',
    body: JSON.stringify(feedbackModelRequest)
  });
};

/**
 * By default, the system finds products with type 'all'
 * @summary Retrieve a paginated list of all products, optionally filtered by type, keyword, and language
 */
export type findProductsResponse = {
  data: PagedModelProductModel;
  status: number;
};

export const getFindProductsUrl = (params: FindProductsParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/api/product?${normalizedParams.toString()}` : `/api/product`;
};

export const findProducts = async (params: FindProductsParams, options?: RequestInit): Promise<findProductsResponse> => {
  return customFetch<Promise<findProductsResponse>>(getFindProductsUrl(params), {
    ...options,
    method: 'GET'
  });
};

/**
 * update installation count when click download product files by users
 * @summary increase installation count by 1
 */
export type findProductDetailsResponse = {
  data: ProductDetailModel;
  status: number;
};

export const getFindProductDetailsUrl = (id: string) => {
  return `/api/product-details/${id}`;
};

export const findProductDetails = async (id: string, options?: RequestInit): Promise<findProductDetailsResponse> => {
  return customFetch<Promise<findProductDetailsResponse>>(getFindProductDetailsUrl(id), {
    ...options,
    method: 'GET'
  });
};

/**
 * get product detail by it product id and release version
 * @summary Find product detail by product id and release version.
 */
export type findProductDetailsByVersionResponse = {
  data: ProductDetailModel;
  status: number;
};

export const getFindProductDetailsByVersionUrl = (id: string, version: string) => {
  return `/api/product-details/${id}/${version}`;
};

export const findProductDetailsByVersion = async (
  id: string,
  version: string,
  options?: RequestInit
): Promise<findProductDetailsByVersionResponse> => {
  return customFetch<Promise<findProductDetailsByVersionResponse>>(getFindProductDetailsByVersionUrl(id, version), {
    ...options,
    method: 'GET'
  });
};

/**
 * get product detail by it product id and version
 * @summary Find best match product detail by product id and version.
 */
export type findBestMatchProductDetailsByVersionResponse = {
  data: ProductDetailModel;
  status: number;
};

export const getFindBestMatchProductDetailsByVersionUrl = (id: string, version: string) => {
  return `/api/product-details/${id}/${version}/bestmatch`;
};

export const findBestMatchProductDetailsByVersion = async (
  id: string,
  version: string,
  options?: RequestInit
): Promise<findBestMatchProductDetailsByVersionResponse> => {
  return customFetch<Promise<findBestMatchProductDetailsByVersionResponse>>(getFindBestMatchProductDetailsByVersionUrl(id, version), {
    ...options,
    method: 'GET'
  });
};

export type findProductVersionsByIdResponse = {
  data: MavenArtifactVersionModel[];
  status: number;
};

export const getFindProductVersionsByIdUrl = (id: string, params: FindProductVersionsByIdParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size
    ? `/api/product-details/${id}/versions?${normalizedParams.toString()}`
    : `/api/product-details/${id}/versions`;
};

export const findProductVersionsById = async (
  id: string,
  params: FindProductVersionsByIdParams,
  options?: RequestInit
): Promise<findProductVersionsByIdResponse> => {
  return customFetch<Promise<findProductVersionsByIdResponse>>(getFindProductVersionsByIdUrl(id, params), {
    ...options,
    method: 'GET'
  });
};

/**
 * Get all feedbacks by product id(from meta.json) which is used in mobile viewport.
 * @summary Find all feedbacks by product id
 */
export type findFeedbackResponse = {
  data: FeedbackModel;
  status: number;
};

export const getFindFeedbackUrl = (id: string) => {
  return `/api/feedback/${id}`;
};

export const findFeedback = async (id: string, options?: RequestInit): Promise<findFeedbackResponse> => {
  return customFetch<Promise<findFeedbackResponse>>(getFindFeedbackUrl(id), {
    ...options,
    method: 'GET'
  });
};

/**
 * Get all user feedback by product id (from meta.json) with lazy loading
 * @summary Find feedbacks by product id with lazy loading
 */
export type findFeedbacksResponse = {
  data: PagedModelFeedbackModel;
  status: number;
};

export const getFindFeedbacksUrl = (id: string, params: FindFeedbacksParams) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null) {
      normalizedParams.append(key, 'null');
    } else if (value !== undefined) {
      normalizedParams.append(key, value.toString());
    }
  });

  return normalizedParams.size ? `/api/feedback/product/${id}?${normalizedParams.toString()}` : `/api/feedback/product/${id}`;
};

export const findFeedbacks = async (id: string, params: FindFeedbacksParams, options?: RequestInit): Promise<findFeedbacksResponse> => {
  return customFetch<Promise<findFeedbacksResponse>>(getFindFeedbacksUrl(id, params), {
    ...options,
    method: 'GET'
  });
};

/**
 * Get overall rating of product by its id.
 * @summary Find rating information of product by its id.
 */
export type getProductRatingResponse = {
  data: ProductRating[];
  status: number;
};

export const getGetProductRatingUrl = (id: string) => {
  return `/api/feedback/product/${id}/rating`;
};

export const getProductRating = async (id: string, options?: RequestInit): Promise<getProductRatingResponse> => {
  return customFetch<Promise<getProductRatingResponse>>(getGetProductRatingUrl(id), {
    ...options,
    method: 'GET'
  });
};
