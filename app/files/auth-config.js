module.exports = {
  enable: true,
  strict: false,
  service: 'getRolesByUserId',
  loginRedirect: '/login',
  roles: {
    GLOBAL: {
      requests: [
        'GET: /(index)?',
        'GET: /login',
        'GET: /search',
        'GET: /forget-password',
        'GET: /act/.*',
        'GET: /shops/\\d+',
        'GET: /shops/\\d+/list',
        'GET: /items/\\d+',
        'GET: /shops',
        'GET: /seller/index',                               // 嘉涛提供的子账号进入商家中心的解决方案
        'POST: /api/user/login',
        'POST: /api/user/logout',
        'GET: /api/user/files/upload',
        'GET: /api/user/(mobile|email|username)-available',
        'GET: /api/user/mobile-check',
        'GET: /api/company',
        'GET: /api/user/captcha',
        'POST: /api/user/register-by-mobile/send-sms',
        'POST: /api/user/register-by-mobile',
        'POST: /api/user/reset-password-by-mobile/send-sms',
        'POST: /api/user/reset-password-by-mobile',
        'GET: /forget-password-success',
        'ALL: /api/refund/notify/.*',
        'POST: /api/order/paid/.*',
        'GET: /api/items',
        'GET: /api/carts/count',
        'GET: /api/coupon/item/\\d+',
        'GET: /api/item/\\d+/promotion',
        'GET: /api/delivery-fee-charge/.*',
        'GET: /api/address/ip-info',
        'GET: /api/address/\\d+/children',
        'GET: /register',
        'GET: /register-company',
        'GET: /api/comment/item-detail/paging',
        'GET: /api/comment/item-detail/replies',
        'ALL: /api/gateway',
        'GET: /api/item/\\d+/sku-price-with-default-promotion',
        'GET: /api/mobile/item/5008',
        'GET: /api/item/5008/detail-info',
        'GET: /api/user/current',
        'GET: /api/design/article/list',
        'GET: /api/design/article/category',
        'GET: /api/design/article',
        'GET: /api/design/article/\\d+',
        'GET: /api/design/article/listCategory',
        'GET: //articles/list',
        'GET: //articles/detail',
        'GET: /seller/accounts',
        'GET: /seller/auth',
        'GET: /seller/auth-create',
        'GET: /api/base-major/tree'
      ]
    },
    LOGIN: {
      requests: [
        'GET: /user/index',
        'GET: /user/update-password'
      ]
    },
    SELLER: {
      requests: [
        'GET: /seller/index',
        'GET: /system/sites',
        'GET: /system/sites/.*'
      ],
      resources: [
        'manage_order', 'manage_refund', 'manage_review',
        'create_item', 'list_item', 'delist_item', 'manage_shop_category', 'sort_item',
        'create_activity',
        'design_shop', 'view_shop_profile',
        'manage_freight',
        'manage_seller_role', 'manage_seller_sub',
        'manage_seller_pictures', 'manage_site_shop_design',
        'manage_settle_order_sum', 'manage_settle_order_detail', 'manage_settle_refund_detail'
      ]
    },
    BUYER: {
      requests: [
        'GET: /buyer/.*'
      ]
    },
    ADMIN: {
      requests: [
        'GET: /system/.*'
      ],
      resources: [
        'manage_site_design', 'manage_site_shop_templet', 'manage_site_article'
      ]
    }
  },
  trees: {
    SUPPLIER: {
      bidsManage: {
        name: '投标管理',
        children: {
          bisLists: {
            name: '投标列表展示',
            resources: ['bid_show']
          }
        }
      },
      companyManage: {
        name: '公司管理',
        children: {
          info: {
            name: '公司基本信息管理',
            children: {
              infoShow: {
                name: '公司基本信息浏览权限',
                resources: ['company_info_show']
              },
              baseInfoEdit: {
                name: '公司基本信息编辑权限',
                resources: ['base_info_edit']
              },
              taxInfoEdit: {
                name: '公司税务与业绩信息编辑权限',
                resources: ['tax_info_edit']
              },
              serviceInfoEdit: {
                name: '公司服务信息编辑权限',
                resources: ['service_info_edit']
              }
            }
          },
          detail: {
            name: '公司信息完善管理',
            children: {
              detailShow: {
                name: '公司信息浏览权限',
                resources: ['company_detail_show']
              },
              contactDetailEdit: {
                name: '公司联系人信息编辑权限',
                resources: ['contact_detail_edit']
              },
              productDetailEdit: {
                name: '公司产品信息编辑权限',
                resources: ['product_detail_edit']
              },
              descriptDetailEdit: {
                name: '公司描述信息编辑权限',
                resources: ['descript_detail_edit']
              }
            }
          },
          auth: {
            name: '公司用户管理',
            children: {
              account: {
                name: '用户管理',
                children: {
                  addAccount: {
                    name: '创建新用户权限',
                    resources: ['add_account']
                  },
                  editAccount: {
                    name: '编辑用户权限',
                    resources: ['edit_account']
                  },
                  deleteAccount: {
                    name: '解绑用户权限',
                    resources: ['delete_account']
                  }
                }
              },
              role: {
                name: '角色管理',
                children: {
                  addRole: {
                    name: '创建新角色权限',
                    resources: ['add_role']
                  },
                  editRole: {
                    name: '编辑角色权限',
                    resources: ['edit_role']
                  },
                  deleteRole: {
                    name: '删除角色权限',
                    resources: ['delete_role']
                  }
                }
              },
              audit: {
                name: '用户审核',
                children: {
                  showList: {
                    name: '浏览用户审核情况',
                    resources: ['audit_list']
                  },
                  audit: {
                    name: '用户审核权限',
                    resources: ['audit_manage']
                  }
                }
              }
            }
          }
        }
      },
      user: {
        name: '账户管理',
        children: {
          profile: {
            name: '个人资料修改',
            resources: ['edit_profile']
          },
          changePassword: {
            name: '修改密码',
            resources: ['change_password']
          },
          apply: {
            name: '加入公司',
            children: {
              applyNew: {
                name: '加入公司',
                resources: ['join_company']
              },
              applyReview: {
                name: '公司审核',
                resources: ['company_review']
              }
            }
          }
        }
      }
    },
    DEVELOPER: {
      query: {
        name: '综合查询管理',
        children: {
          query_material: {
            name: '材料查询',
            resources: ['query_material']
          },
          tao_jia: {
            name: '套价',
            resources: ['tao_jia']
          },
          xun_yuan: {
            name: '寻源',
            resources: ['xun_yuan']
          }
        }
      },
      bids: {
        name: '招标管理',
        children: {
          project_manage: {
            name: '项目管理',
            resources: ['project_manage']
          },
          bids_project_manage: {
            name: '招投标管理',
            resources: ['bids_project_manage']
          },
        }
      },
      companyManage: {
        name: '公司管理',
        children: {
          info: {
            name: '公司基本信息管理',
            children: {
              infoShow: {
                name: '公司基本信息浏览权限',
                resources: ['company_info_show']
              },
              infoEdit: {
                name: '公司基本信息编辑权限',
                resources: ['company_info_edit']
              }
            }
          },
          detail: {
            name: '公司信息完善管理',
            children: {
              infoShow: {
                name: '公司信息浏览权限',
                resources: ['company_detail_show']
              },
              infoEdit: {
                name: '公司信息编辑权限',
                resources: ['company_detail_edit']
              }
            }
          },
          auth: {
            name: '公司用户管理',
            children: {
              account: {
                name: '用户管理',
                children: {
                  addAccount: {
                    name: '创建新用户权限',
                    resources: ['add_account']
                  },
                  editAccount: {
                    name: '编辑用户权限',
                    resources: ['edit_account']
                  },
                  deleteAccount: {
                    name: '解绑用户权限',
                    resources: ['delete_account']
                  }
                }
              },
              role: {
                name: '角色管理',
                children: {
                  addRole: {
                    name: '创建新角色权限',
                    resources: ['add_role']
                  },
                  editRole: {
                    name: '编辑角色权限',
                    resources: ['edit_role']
                  },
                  deleteRole: {
                    name: '删除角色权限',
                    resources: ['delete_role']
                  }
                }
              },
              audit: {
                name: '用户审核',
                children: {
                  showList: {
                    name: '浏览用户审核情况',
                    resources: ['audit_list']
                  },
                  audit: {
                    name: '用户审核权限',
                    resources: ['audit_manage']
                  }
                }
              }
            }
          }
        }
      },
      supplierManage: {
        name: '供应商管理',
        children: {
          library_supplier: {
            name: '库内供应商',
            resources: ['library_supplier']
          },
          collect_supplier: {
            name: '待考察供应商',
            resources: ['collect_supplier']
          },
          import_supplier: {
            name: '导入供应商',
            resources: ['import_supplier']
          }
        }
      },
      user: {
        name: '账户管理',
        children: {
          profile: {
            name: '个人资料修改',
            resources: ['edit_profile']
          },
          changePassword: {
            name: '修改密码',
            resources: ['change_password']
          },
          apply: {
            name: '加入公司',
            children: {
              applyNew: {
                name: '加入公司',
                resources: ['join_company']
              },
              applyReview: {
                name: '公司审核',
                resources: ['company_review']
              }
            }
          }
        }
      },
      others: {
        name: '其他管理',
        children: {
          seller_pictures: {
            name: '图片管理',
            resources: ['manage_seller_pictures']
          }
        }
      }
    },
    OPERATOR: {
      sitemanager: {
        name: '站点管理',
        children: {
          site_design: {
            name: '站点装修管理',
            resources: ['manage_site_design']
          },
          site_shop_templet: {
            name: '店铺模版管理',
            resources: ['manage_site_shop_templet']
          },
          site_article: {
            name: '文章管理',
            resources: ['manage_site_article']
          },
          site_shop_design: {
            name: '店铺装修管理',
            resources: ['manage_site_shop_design']
          }
        }
      }
    }
  },
  resources: {
    manage_order: {
      requests: ['GET: /seller/order']
    },
    manage_refund: {
      requests: ['GET: /seller/sku-return']
    },
    manage_review: {
      requests: ['GET: /seller/comments']
    },
    create_item: {
      requests: ['GET: /seller/release-items']
    },
    list_item: {
      requests: ['GET: /seller/on-shelf']
    },
    delist_item: {
      requests: ['GET: /seller/off-shelf']
    },
    manage_shop_category: {
      requests: ['GET: /seller/shop-category']
    },
    sort_item: {
      requests: ['GET: /seller/item-sort']
    },
    create_activity: {
      requests: ['GET: /seller/marketing/activity-index']
    },
    design_shop: {
      requests: ['GET: /seller/design']
    },
    view_shop_profile: {
      requests: ['GET: /seller/profile']
    },
    manage_freight: {
      requests: ['GET: /seller/freight']
    },
    manage_seller_role: {
      requests: ['GET: /seller/auth']
    },
    manage_seller_sub: {
      requests: ['GET: /seller/accounts']
    },
    manage_seller_pictures: {
      requests: ['GET: /seller/pictures']
    },
    manage_settle_order_sum: {
      requests: ['GET: /seller/settlement/order-sum']
    },
    manage_settle_order_detail: {
      requests: ['GET: /seller/settlement/order-detail']
    },
    manage_settle_refund_detail: {
      requests: ['GET: /seller/settlement/refund-detail']
    },
    manage_site_design: {
      requests: [
        'GET: /system/sites(|/styles/.*|/scripts/.*|/fonts/.*|/images/.*)',
        'ALL: /api/design/.*',
        'ALL: /api/images/.*',
        'ALL: /design/.*',
      ]
    },
    manage_site_shop_templet: {
      requests: [
        'GET: /system/sites(|/styles/.*|/scripts/.*|/fonts/.*|/images/.*)',
        'ALL: /api/design/.*',
        'ALL: /api/images/.*',
        'ALL: /design/.*',
      ]
    },
    manage_site_article: {
      requests: [
        'GET: /system/sites(|/styles/.*|/scripts/.*|/fonts/.*|/images/.*)',
        'ALL: /api/design/.*',
        'ALL: /api/images/.*',
        'ALL: /design/.*',
      ]
    },
    manage_site_shop_design: {
      requests: [
        'GET: /system/sites(|/styles/.*|/scripts/.*|/fonts/.*|/images/.*)',
        'ALL: /api/design/.*',
        'ALL: /api/images/.*',
        'ALL: /design/.*',
      ]
    }
  }
};
