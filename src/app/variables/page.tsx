'use client';
import { Variables } from '@/components/Variables/Variables';
import { authCheck } from '@/hocs/authCheck';

const AuthenticatedVariables = authCheck(Variables);

export default AuthenticatedVariables;
