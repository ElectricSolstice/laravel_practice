<?php

namespace App\Helpers;

use Illuminate\Http\Request;

class ControllerHelper
{
    public const DATE_FORMAT= 'd-m-Y h:i';

    public static function getMessageBatch(Request $request, $model, $messageIdField, $messageId, $batchSize, $orderField, $order)
    {
        $validatedData = $request->validate([
            'offset' => 'nullable|integer|min:0'
        ]);
        $offset = $request->input('offset', 0);

        $batch = $model::where($messageIdField, $messageId)->orderBy($orderField, $order)->offset($offset)->limit($batchSize)->with('user:id,name')->get();
        return $batch;
    }
}
