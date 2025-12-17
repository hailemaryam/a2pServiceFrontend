# API Integration Guide

This directory contains all RTK Query API slices for the application. All APIs are modular and inject into the base `baseApi`.

## Available API Slices

### 1. **contactsApi.ts** (Already existed)
- `useFetchContactsQuery` - Get paginated contacts
- `useGetContactByIdQuery` - Get contact by ID
- `useCreateContactMutation` - Create new contact
- `useUpdateContactMutation` - Update contact
- `useSearchContactByPhoneQuery` - Search contact by phone
- `useUploadContactsMultipartMutation` - Upload contacts CSV

### 2. **contactGroupsApi.ts** (NEW)
- `useGetContactGroupsQuery` - Get all contact groups
- `useGetContactGroupByIdQuery` - Get group by ID
- `useCreateContactGroupMutation` - Create new group
- `useUpdateContactGroupMutation` - Update group
- `useDeleteContactGroupMutation` - Delete group

### 3. **smsApi.ts** (NEW)
- `useSendSingleSmsMutation` - Send single SMS
- `useSendGroupSmsMutation` - Send SMS to group
- `useSendBulkSmsMutation` - Send bulk SMS (file upload)
- `useGetSmsHistoryQuery` - Get SMS history/logs
- `useGetSmsJobByIdQuery` - Get SMS job details

**Note**: SMS history endpoint (`GET /api/sms/jobs`) may not exist yet - placeholder included

### 4. **sendersApi.ts** (NEW)
- `useGetSendersQuery` - Get all sender IDs
- `useGetSenderByIdQuery` - Get sender by ID
- `useCreateSenderMutation` - Create/request new sender ID
- `useUpdateSenderMutation` - Update sender
- `useDeleteSenderMutation` - Delete sender

### 5. **paymentApi.ts** (NEW)
- `useInitializePaymentMutation` - Initialize Chapa payment
- `useVerifyPaymentQuery` - Verify payment status
- `useGetTransactionsQuery` - Get payment history
- `useGetTransactionByIdQuery` - Get transaction details

### 6. **apiKeyApi.ts** (NEW)
- `useGetApiKeysQuery` - Get all API keys
- `useGetApiKeyByIdQuery` - Get API key by ID
- `useCreateApiKeyMutation` - Create new API key
- `useRevokeApiKeyMutation` - Revoke/delete API key
- `useUpdateApiKeyMutation` - Update API key (name, active status)

### 7. **profileApi.ts** (NEW)
- `useGetProfileQuery` - Get current user profile
- `useUpdateProfileMutation` - Update profile

### 8. **adminApi.ts** (NEW - SysAdmin only)
- `useGetTenantsQuery` - Get all tenants (paginated)
- `useGetTenantByIdQuery` - Get tenant by ID
- `useGetPendingSendersQuery` - Get pending sender approvals
- `useApproveSenderMutation` - Approve/reject sender
- `useGetPendingSmsJobsQuery` - Get pending SMS job approvals
- `useApproveSmsJobMutation` - Approve/reject SMS job
- `useGetSmsPackagesQuery` - Get all SMS packages
- `useCreateSmsPackageMutation` - Create SMS package
- `useUpdateSmsPackageMutation` - Update SMS package
- `useDeleteSmsPackageMutation` - Delete SMS package
- `useGetTenantPackagesQuery` - Get packages for tenant users (may use `/api/packages`)

## Usage Example

```typescript
import { useGetSendersQuery, useSendSingleSmsMutation } from "../api/sendersApi";
import { useGetSendersQuery } from "../api/sendersApi";

function SendSMS() {
  const { data: senders, isLoading } = useGetSendersQuery();
  const [sendSms, { isLoading: isSending }] = useSendSingleSmsMutation();

  const handleSend = async () => {
    try {
      const result = await sendSms({
        senderId: "123",
        phoneNumber: "+1234567890",
        message: "Hello",
      }).unwrap();
      console.log("SMS sent:", result);
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Your form */}
    </div>
  );
}
```

## Next Steps

1. Replace dummy/mock data in pages with RTK Query hooks
2. Handle loading and error states in components
3. Confirm missing backend endpoints (e.g., SMS history)
4. Test all API integrations

