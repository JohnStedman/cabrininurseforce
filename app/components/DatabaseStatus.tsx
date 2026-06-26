import React from 'react';
import { useSupabase } from '../hooks/useSupabase';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { Badge } from './ui/badge';

export function DatabaseStatus() {
  const { isConfigured, isInitialized, isLoading, dbStatus, initializeDatabase, refreshStatus } = useSupabase();

  if (!isConfigured) {
    return (
      <Card className="border-2 border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900 mb-1">Supabase Not Configured</h3>
            <p className="text-sm text-amber-700 mb-3">
              Please configure your Supabase connection to enable data persistence. Add your Supabase URL and Anon Key to the environment variables.
            </p>
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-3 font-mono text-xs text-amber-800">
              <div>VITE_SUPABASE_URL=your_supabase_url</div>
              <div>VITE_SUPABASE_ANON_KEY=your_anon_key</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${isInitialized ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'} p-4`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg ${isInitialized ? 'bg-green-100' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
          <Database className={`h-5 w-5 ${isInitialized ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${isInitialized ? 'text-green-900' : 'text-blue-900'}`}>
              Database Status
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshStatus}
              disabled={isLoading}
              className="h-7 px-2"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {isInitialized ? (
            <>
              <p className="text-sm text-green-700 mb-3">
                ✓ Database is connected and initialized. All data is being persisted to Supabase.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-green-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-700 font-medium">Shifts</span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-900">{dbStatus.shiftCount}</div>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-700 font-medium">Staff</span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-900">{dbStatus.staffCount}</div>
                </div>
                <div className="bg-white border border-green-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-green-700 font-medium">Wards</span>
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-green-900">{dbStatus.wardCount}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-blue-700 mb-3">
                Database is connected but not initialized. Click below to migrate your data to Supabase.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="bg-white border-blue-200">
                  {dbStatus.hasShifts ? <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                  Shifts: {dbStatus.shiftCount}
                </Badge>
                <Badge variant="secondary" className="bg-white border-blue-200">
                  {dbStatus.hasStaff ? <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                  Staff: {dbStatus.staffCount}
                </Badge>
                <Badge variant="secondary" className="bg-white border-blue-200">
                  {dbStatus.hasWards ? <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> : <XCircle className="h-3 w-3 mr-1 text-gray-400" />}
                  Wards: {dbStatus.wardCount}
                </Badge>
              </div>
              <Button
                onClick={initializeDatabase}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? 'Initializing...' : 'Initialize Database with Sample Data'}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
